const activeScene = {
  name: "s1",
  part: "s1-start",
  stepIndex: 11,
  layerOne: {},
  layerTwo: {},
  activeLayer: "layerOne",
  x: 950,
  y: 620,
  hue: 0,
  focusedChoiceIndex: 0,
  activatedChoiceIndex: -1, // for special leave animation
  // used by choice boxes separatly due to varied animations
  showChoiceSection: true,
  showText: true,
  preventNext: false,
  init() {
    WORLD.loop.add(() => {
      if (GLOBAL.context !== "scene") return
      this.scriptParser(SCENE.mdPlainTexts[this.part])
      this.updateData()
    }, "ACTIVE_SCENE")
    this.addEvent
  },
  addEvent() {
    EVENTS.onSingle("continue", () => {
      if (this.stepIndex >= this.steps.length) {
        this.stepIndex = -1
        GLOBAL.context = "world"
      }
      if (this.preventNext) return
      this.preventNext = true
      this.updateImages()
      this.activatedChoiceIndex = this.focusedChoiceIndex
      const lastStep = this.steps[this.stepIndex] as AnyObject
      const step = this.steps[this.stepIndex + 1] as AnyObject
      if (step && step.choices.length === 0) this.showChoiceSection = false
      else this.showChoiceSection = true
      if (!step || step.text !== lastStep.text) {
        ACTIVE_SCENE.showText = false
      }
      setTimeout(() => {
        this.stepIndex++
        ACTIVE_SCENE.showText = true
        this.preventNext = false
      }, 300)
      setTimeout(() => {
        this.focusedChoiceIndex = 0
        this.activatedChoiceIndex = -1
      }, 1000)
    })
  },
  initialUpdateImages() {
    if (GLOBAL.context === "scene" && this.steps.length === 0) return
    const step = this.steps[this.stepIndex + 1] as AnyObject
    this.imageLayer = step.images
  },
  updateImages() {
    const lastStep = this.steps[this.stepIndex] as AnyObject
    const step = this.steps[this.stepIndex + 1] as AnyObject
    if (step && !_.isEqual(step.images, lastStep.images)) {
      if (this.activeImageLayer === "imageLayer") {
        this.activeImageLayer = "secondImageLayer"
        this.secondImageLayer = step.images
      } else {
        this.activeImageLayer = "imageLayer"
        this.imageLayer = step.images
      }
    }
    console.log(this.imageLayer, this.secondImageLayer)
  },
  updateData() {
    let steps = this.steps as AnyObject[]
    let options = SCENE.options as AnyObject
    this.text = steps[this.stepIndex]?.text
    this.choices = steps[this.stepIndex]?.choices
    let images = []
    if (this.activeImageLayer === "imageLayer") images = this.imageLayer
    else images = this.secondImageLayer
    this.x = options[this.name][images[0]]?.x || 950
    this.y = options[this.name][images[0]]?.y || 620
    this.hue = options[this.name][images[0]]?.hue || 0
  },
}
export const ACTIVE_SCENE = LIB.store(activeScene)
