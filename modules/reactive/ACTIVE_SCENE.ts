const activeScene = {
  name: "",
  nextSceneName: "",
  stepIndex: 51,
  layerOne: {},
  layerTwo: {}, // images, text, choices, x, y, hue
  // choices: [{
  //   text: "",
  //   nextSceneName: "",
  //   arrow: false
  // }]
  activeLayer: "layerOne",
  focusedChoiceIndex: 0,
  showChoiceBox: false,
  showText: true,
  lastContinueMS: 0,
  init() {
    // 📜 handle this scene emit by some user data
    EVENTS.emit("startScene", { name: "s1-start" })
    WORLD.loop.add(() => {
      if (GLOBAL.context !== "scene") return
      this.updateData()
    }, "ACTIVE_SCENE")
    EVENTS.on("startScene", (options) => {
      this.name = options.name
      this.nextSceneName = options.name
      // this.stepIndex = 0
      GLOBAL.context = "scene"
    })
    EVENTS.onSingle("endScene", () => {
      GLOBAL.context = "world"
      INTERFACE.inventory = false
    })
    EVENTS.onSingle("mouseContinue", () => {
      if (this.showChoiceBox) return // handled by direct click event on choice
      else EVENTS.emitSingle("continue")
    })
    EVENTS.onSingle("continue", () => {
      console.log(SCENE, ACTIVE_SCENE, ASSETS)
      if (this.lastContinueMS + CONFIG.scene.skipDelay > WORLD.loop.elapsedMS)
        return
      this.lastContinueMS = WORLD.loop.elapsedMS
      const steps = this.getSteps()
      if (!steps) return
      const { step, nextStep } = steps
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
      step.choices[ACTIVE_SCENE.focusedChoiceIndex].nextSceneName
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
    layer.x = SCENE.optionsByImage[layer.images[0]]?.x || 950
    layer.y = SCENE.optionsByImage[layer.images[0]]?.y || 620
    layer.hue = SCENE.optionsByImage[layer.images[0]]?.hue || 0
  },
}
export const ACTIVE_SCENE = LIB.store(activeScene)
