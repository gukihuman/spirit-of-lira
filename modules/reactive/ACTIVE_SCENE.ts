interface activeScene extends AnyObject {
  layerOne: SceneLayer
  layerTwo: SceneLayer
}
const activeScene = {
  name: "",
  nextSceneName: "",
  stepIndex: 0,
  layerOne: {},
  layerTwo: {},
  activeLayer: "layerOne",
  showChoiceBox: false,
  showText: true,
  lastContinueMS: 0,
  focusedChoiceIndex: 0,
  init() {
    WORLD.loop.add(() => {
      if (GLOBAL.context !== "scene") return
      this.updateData()
    }, "ACTIVE_SCENE")

    // this is alternativ to startScene event at start (also no transition)
    if (!PROGRESS.scenes.includes("s0")) {
      GLOBAL.context = "scene"
      this.name = "s0-adult-check"
      EVENTS.emitSingle("continue")
    }
    EVENTS.on("startScene", (options) => {
      GLOBAL.context = "scene"
      this.name = options.name
      this.nextSceneName = options.name // used each continue
      this.stepIndex = 0
      if (options.instantChoices) {
        setTimeout(() => EVENTS.emitSingle("continue"), 20)
      }
    })
    EVENTS.onSingle("endScene", () => {
      GLOBAL.context = "world"
      INTERFACE.inventory = false
      PROGRESS.scenes.push(this.name.split("-")[0])
      this.name = ""
      LOCAL.update()
    })
    EVENTS.onSingle("mouseContinue", () => {
      if (this.showChoiceBox) return // handled by direct click event on choice
      else EVENTS.emitSingle("continue")
    })
    EVENTS.onSingle("continue", () => {
      if (this.lastContinueMS + CONFIG.scene.skipDelay > WORLD.loop.elapsedMS)
        return
      this.lastContinueMS = WORLD.loop.elapsedMS
      const steps = this.getSteps()
      if (!steps) return
      const { step, nextStep } = steps
      this.runChoiceEvent(step)
      if ((nextStep && nextStep.choices.length === 0) || !nextStep) {
        this.showChoiceBox = false
      } else {
        // prevent quick appearance on first time
        setTimeout(() => (this.showChoiceBox = true), 10)
        const layerOne = this.layerOne as AnyObject
        const layerTwo = this.layerTwo as AnyObject
        layerOne.choices = nextStep.choices
        layerTwo.choices = nextStep.choices
        this.focusedChoiceIndex = 0
      }
      if (nextStep) {
        if (nextStep.text !== step.text) this.showText = false
        let delay = 50
        if (!_.isEqual(step.images, nextStep.images)) {
          delay = CONFIG.scene.transitionSpeed * 0.5
          this.activeLayer = "layerTwo"
          setTimeout(() => {
            this.activeLayer = "layerOne"
          }, delay)
        }
        setTimeout(() => {
          this.showText = true
          this.stepIndex++
        }, delay)
      }
      if (this.name === this.nextSceneName || !this.nextSceneName) {
        if (this.stepIndex >= SCENE.steps[this.name].length - 1) {
          EVENTS.emitSingle("endScene")
        }
      } else {
        this.stepIndex = -1
        this.name = this.nextSceneName
      }
    })
    EVENTS.onSingle("keepAdultCheck", () => {
      setTimeout(() => _.remove(PROGRESS.scenes, (s) => s === "s0"), 20)
      LOCAL.update()
    })
  },
  runChoiceEvent(step) {
    if (step.choices.length === 0) return
    let choiceEvents = step.choices[this.focusedChoiceIndex].choiceEvents
    if (choiceEvents) {
      choiceEvents.split(",").forEach((s) => {
        EVENTS.emitSingle(s.trim())
      })
    }
  },
  getSteps() {
    if (!SCENE.steps[ACTIVE_SCENE.name]) return
    const step = SCENE.steps[ACTIVE_SCENE.name][ACTIVE_SCENE.stepIndex]
    if (!step) return
    let nextStep
    if (step.choices.length === 0) {
      nextStep = SCENE.steps[ACTIVE_SCENE.name][ACTIVE_SCENE.stepIndex + 1]
      return { step, nextStep }
    }
    ACTIVE_SCENE.nextSceneName =
      step.choices[this.focusedChoiceIndex].nextSceneName
    if (
      !ACTIVE_SCENE.nextSceneName ||
      ACTIVE_SCENE.name === ACTIVE_SCENE.nextSceneName
    ) {
      nextStep = SCENE.steps[ACTIVE_SCENE.name][ACTIVE_SCENE.stepIndex + 1]
    } else {
      nextStep = SCENE.steps[ACTIVE_SCENE.nextSceneName][0]
    }
    return { step, nextStep }
  },
  updateData() {
    let layer, nextlayer
    layer = ACTIVE_SCENE.layerOne
    nextlayer = ACTIVE_SCENE.layerTwo
    const steps = this.getSteps()
    if (!steps) return
    const { step, nextStep } = steps
    this.updateLayerData(layer, step)
    if (nextStep) this.updateLayerData(nextlayer, nextStep)
  },
  updateLayerData(layer, step) {
    layer.images = step.images
    layer.text = step.text
    layer.x = SCENE.options[layer.images[0]]?.x || 950
    layer.y = SCENE.options[layer.images[0]]?.y || 620
    layer.hue = SCENE.options[layer.images[0]]?.hue || 0
    layer.brightness = SCENE.options[layer.images[0]]?.brightness || 1
  },
}
export const ACTIVE_SCENE = LIB.store(activeScene)
