const activeScene = {
  name: "",
  nextSceneName: "",
  stepIndex: 0,
  layerOne: {},
  layerTwo: {}, // images, text, choices, x, y, hue
  // choices: [{
  //   text: "",
  //   nextSceneName: "",
  //   arrow: false
  // }]
  activeLayer: "layerOne",
  focusedChoiceIndex: 0,
  showChoiceBox: true,
  showText: true,
  preventNext: false,
  init() {
    WORLD.loop.add(() => {
      if (GLOBAL.context !== "scene") return
      this.updateData()
      EVENTS.emit("startScene", { name: "s1-start" })
    }, "ACTIVE_SCENE")
    EVENTS.on("startScene", (options) => {
      this.name = options.name
      this.stepIndex = 0
      GLOBAL.context = "scene"
    })
    EVENTS.onSingle("endScene", () => {
      GLOBAL.context = "world"
    })
    EVENTS.onSingle("continue", () => {
      if (this.preventNext) return
      this.preventNext = true
      const steps = this.getSteps()
      if (!steps) return
      const { step, nextStep } = steps
      if (nextStep && nextStep.choices.length === 0) this.showChoiceBox = false
      else this.showChoiceBox = true
      if (nextStep.text !== step.text) this.showText = false
      setTimeout(() => {
        if (this.activeLayer === "layerOne") this.activeLayer = "layerTwo"
        else this.activeLayer = "layerOne"
        console.log(this.activeLayer)
        if (this.name === this.nextSceneName) {
          this.stepIndex++
          if (this.stepIndex >= SCENE.steps[this.name].length) {
            this.stepIndex = 0
            GLOBAL.context = "world"
          }
        } else {
          this.stepIndex = 0
          this.name = this.nextSceneName
        }
        this.showText = true
        this.preventNext = false
      }, 50)
      setTimeout(() => {
        this.focusedChoiceIndex = 0
      }, 1000)
    })
  },
  getSteps() {
    if (!SCENE.steps[ACTIVE_SCENE.name]) return
    const step = SCENE.steps[ACTIVE_SCENE.name][ACTIVE_SCENE.stepIndex]
    let nextStep
    if (step.choices.length === 0) {
      nextStep = SCENE.steps[ACTIVE_SCENE.name][ACTIVE_SCENE.stepIndex + 1]
      return { step, nextStep }
    }
    ACTIVE_SCENE.nextSceneName =
      step.choices[ACTIVE_SCENE.focusedChoiceIndex].nextSceneName
    if (ACTIVE_SCENE.name === ACTIVE_SCENE.nextSceneName) {
      nextStep = SCENE.steps[ACTIVE_SCENE.name][ACTIVE_SCENE.stepIndex + 1]
    } else {
      nextStep = SCENE.steps[ACTIVE_SCENE.nextSceneName][0]
    }
    return { step, nextStep }
  },
  updateData() {
    let layer, nextlayer
    if (ACTIVE_SCENE.activeLayer === "layerOne") {
      layer = ACTIVE_SCENE.layerOne
      nextlayer = ACTIVE_SCENE.layerTwo
    } else {
      layer = ACTIVE_SCENE.layerTwo
      nextlayer = ACTIVE_SCENE.layerOne
    }
    const steps = this.getSteps()
    if (!steps) return
    const { step, nextStep } = steps
    this.updateLayerData(layer, step)
    if (nextStep) this.updateLayerData(nextlayer, nextStep)
  },
  updateLayerData(layer, step) {
    layer.images = step.images
    layer.text = step.text
    layer.choices = step.choices
    layer.x = SCENE.optionsByImage[layer.images[0]]?.x || 950
    layer.y = SCENE.optionsByImage[layer.images[0]]?.y || 620
    layer.hue = SCENE.optionsByImage[layer.images[0]]?.hue || 0
  },
}
export const ACTIVE_SCENE = LIB.store(activeScene)
