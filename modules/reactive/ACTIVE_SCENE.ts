import { g } from "vitest/dist/index-40ebba2b"

type Choice = {
  text?: string
  nextSceneName?: string
  choiceEvents?: string // events separated by comma like "event1, event2"
  arrow?: boolean
  bulb?: boolean
  bulbScene?: string
}
type SceneLayer = {
  images?: string[]
  text?: string
  choices?: Choice[]
  x?: number
  y?: number
  hue?: number
}
interface activeScene extends AnyObject {
  layerOne: SceneLayer
  layerTwo: SceneLayer
  activeLayer: "layerOne" | "layerTwo"
  focusedChoiceIndex: number | null
}
const activeScene: activeScene = {
  name: "",
  leaveMenuMS: 0,
  nextSceneName: "",
  stepIndex: 0,
  layerOne: {},
  layerTwo: {},
  activeLayer: "layerOne",
  showChoiceBox: false,
  showText: true,
  lastContinueMS: 0,
  focusedChoiceIndex: null,
  process() {
    SCENE.menuScenes.forEach((menuScene) => {
      if (!LAST.sceneName) return
      if (LAST.sceneName === this.name) return
      if (LAST.sceneName.includes(menuScene)) {
        this.leaveMenuMS = LOOP.elapsedMS
      }
    })
  },
  init() {
    LOOP.add(() => {
      if (!CONTEXT.echo.scene) return
      this.updateData()
    }, "ACTIVE_SCENE")

    // this is alternative to startScene event at start (also no transition)
    if (!PROGRESS.scenes.includes("a0")) {
      CONTEXT.set("scene")
      this.name = "a0-adult-check"
      EVENTS.emitSingle("continue") // trigger choices appearance :)
    }
    EVENTS.on("startScene", (options) => {
      if (!options.name) return
      CONTEXT.set("scene")
      this.name = options.name
      this.nextSceneName = options.name // used each continue
      this.stepIndex = 0
      if (options.instantChoices) {
        setTimeout(() => EVENTS.emitSingle("continue"), 20)
      }
    })
    EVENTS.onSingle("quitScene", () => {
      CONTEXT.set("world")
      this.name = ""
    })
    EVENTS.onSingle("endScene", () => {
      if (!PROGRESS.scenes.includes(this.name.split("-")[0])) {
        PROGRESS.scenes.push(this.name.split("-")[0])
      }
      SAVE.update()
      CONTEXT.set("world")
      setTimeout(() => (this.name = ""), 1000)
    })
    EVENTS.onSingle("mouseContinue", () => {
      if (this.showChoiceBox) return // handled by direct click event on choice
      if (INTERFACE.skipHover) return
      else EVENTS.emitSingle("continue")
    })
    EVENTS.onSingle("continue", () => {
      if (this.lastContinueMS + CONFIG.scene.skipDelay > LOOP.elapsedMS) return
      this.lastContinueMS = LOOP.elapsedMS
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
        let possibleIndex: number | null = null
        // 📜 maybe merge with previous and next in settings
        for (let i = 0; i < nextStep.choices.length; i++) {
          const choice = nextStep.choices[i]
          if (!choice.bulb) {
            possibleIndex = i
            break
          }
          const condition: Condition | undefined =
            SCENE.sceneConditions[choice.bulbScene]
          if (!condition) {
            possibleIndex = i
            break
          }
          if (condition.getCondition()) {
            possibleIndex = i
            break
          }
        }
        this.focusedChoiceIndex = possibleIndex
      }
      if (this.focusedChoiceIndex === null) return
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
      setTimeout(() => _.remove(PROGRESS.scenes, (s) => s === "a0"), 20)
      SAVE.update()
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
export const ACTIVE_SCENE = LIBRARY.resonateObject(activeScene)
