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
    lastContinueMS: -Infinity, // 0 not allow to continue on adult check :)
    focusedChoiceIndex: null,
    process() {
        SCENE.menuScenes.forEach((menuScene) => {
            if (!LAST.sceneName) return
            if (LAST.sceneName === this.name) return
            if (LAST.sceneName.includes(menuScene)) {
                this.leaveMenuMS = LOOP.elapsed
            }
        })
    },
    init() {
        LOOP.add(() => {
            if (!GAME_STATE.echo.scene) return
            this.updateData()
        }, "SCENE_ACTIVE")
        EVENTS.on("startScene", (options) => {
            if (!options.name) return
            GAME_STATE.set("scene")
            this.name = options.name
            this.nextSceneName = options.name // used each continue
            this.stepIndex = 0
            if (options.instantChoices) {
                TIME.run_after_iterations(() => EVENTS.emitSingle("continue"))
            }
        })
        EVENTS.onSingle("skipScene", () => {
            if (this.name === "a0-adult-check") return
            EVENTS.emitSingle("endScene")
        })
        EVENTS.onSingle("endScene", () => {
            if (!PROGRESS.scenes.includes(this.name.split("-")[0])) {
                PROGRESS.scenes.push(this.name.split("-")[0])
            }
            HERO.reset_destination()
            SAVE.update()
            GAME_STATE.set("world")
            setTimeout(() => (this.name = ""), 1000)
        })
        EVENTS.onSingle("resolveAdultCheckEndScene", () => {
            if (!PROGRESS.scenes.includes("n1")) {
                if (!PROGRESS.scenes.includes(this.name.split("-")[0])) {
                    PROGRESS.scenes.push(this.name.split("-")[0])
                }
                SAVE.update()
                GAME_STATE.set("empty")
                TIME.run_after(() => {
                    this.name = "" // some styling binded to scene name
                    EVENTS.emit("startScene", { name: "n1-start" })
                }, 500)
            } else EVENTS.emitSingle("endScene")
        })

        EVENTS.onSingle("keepAdultCheck", () => {
            TIME.run_after_iterations(() =>
                _.remove(PROGRESS.scenes, (s) => s === "a0")
            )
            SAVE.update()
        })
        EVENTS.onSingle("mouseContinue", () => {
            if (this.showChoiceBox) return // handled by direct click event on choice
            if (INTERFACE.skipHover || INTERFACE.buttonHover) return
            else EVENTS.emitSingle("continue")
        })
        EVENTS.onSingle("continue", () => {
            if (this.lastContinueMS + CONFIG.scene.skipDelay > LOOP.elapsed)
                return
            this.lastContinueMS = LOOP.elapsed
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
            if (step.choices.length > 0 && this.focusedChoiceIndex === null)
                return
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
        if (!SCENE.steps[SCENE_ACTIVE.name]) return
        const step = SCENE.steps[SCENE_ACTIVE.name][SCENE_ACTIVE.stepIndex]
        if (!step) return
        let nextStep
        if (step.choices.length === 0) {
            nextStep =
                SCENE.steps[SCENE_ACTIVE.name][SCENE_ACTIVE.stepIndex + 1]
            return { step, nextStep }
        }
        SCENE_ACTIVE.nextSceneName =
            step.choices[this.focusedChoiceIndex].nextSceneName
        if (
            !SCENE_ACTIVE.nextSceneName ||
            SCENE_ACTIVE.name === SCENE_ACTIVE.nextSceneName
        ) {
            nextStep =
                SCENE.steps[SCENE_ACTIVE.name][SCENE_ACTIVE.stepIndex + 1]
        } else {
            nextStep = SCENE.steps[SCENE_ACTIVE.nextSceneName][0]
        }
        return { step, nextStep }
    },
    updateData() {
        let layer, nextlayer
        layer = SCENE_ACTIVE.layerOne
        nextlayer = SCENE_ACTIVE.layerTwo
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
export const SCENE_ACTIVE = LIBRARY.resonateObject(activeScene)
