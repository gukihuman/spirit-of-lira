declare global {
    type Condition = {
        getText: () => string
        getCondition: () => boolean
    }
}
interface sceneConditions extends AnyObject {
    [file_name: string]: Condition
}
type sceneOptions = {
    x?: number
    y?: number
    hue?: number
    brightness?: number
}
type Options = { [file_name: string]: sceneOptions }
type PlainTextsObject = { [file_name: string]: string }
type ChoiceObject = {
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
    choices?: ChoiceObject[]
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
interface Echo extends AnyObject {
    focusedChoiceIndex: number | null
}
class Scene {
    echo: Echo = {
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
    }
    mds_plain_texts: PlainTextsObject = {}
    menu_scenes: string[] = []
    options: Options = {
        "n1-lira-no-light": { hue: -30 },
        "n1-lira-arms-down": { hue: -30 },
        "n1-lira-arms-raised": { hue: -30 },
        "n1-nighty": { x: 370, y: 700 },
        "n1-nighty-close": { x: 950 },
        "a0-solid-dark": { x: 610, y: 750, brightness: 1.1 },
    }
    sceneConditions: sceneConditions = {
        b1: {
            getText: () => `Kill bunbos ${PROGRESS.mobs.bunbo} / 20`,
            getCondition: () => PROGRESS.mobs.bunbo >= 20,
        },
    }
    steps = {}
    async init() {
        for (const [file_name, path] of _.entries(ASSETS.md_paths)) {
            const response = await fetch(path)
            this.mds_plain_texts[file_name] = await response.text()
        }

        _.forEach(this.mds_plain_texts, (value, file_name) => {
            this.steps[file_name] = []
            let lineArray
            if (value.includes("\r\n")) {
                lineArray = value.split("\r\n")
            } else {
                lineArray = value.split("\n") // for vercel environment
            }
            let images: string[] = []
            const step: AnyObject = {
                images: [],
                text: "",
                choices: [],
            }
            lineArray.forEach((line, index) => {
                // handle images
                if (line.startsWith("# ")) {
                    let cleanLine = line.substring(2)
                    images = cleanLine.split(", ")
                    return
                }
                // choice lines doesnt immideately create a step, this is where we push step with all collected choices and previous text
                let createChoiceStep = () => {
                    if (step.choices.length > 0) {
                        _.reverse(step.choices)
                        this.steps[file_name].push(_.cloneDeep(step))
                        step.choices = []
                    }
                }
                // handle choices
                if (line.startsWith(">")) {
                    let choiceObject: AnyObject = {}
                    let cleanLine = ""
                    if (line.startsWith("> ")) {
                        cleanLine = line.substring(2)
                    }
                    if (line.startsWith(">> ")) {
                        choiceObject.arrow = true
                        cleanLine = line.substring(3)
                    }
                    if (line.startsWith(">[")) {
                        choiceObject.bulb = true
                        choiceObject.bulbScene = line.substring(
                            2,
                            line.indexOf("]")
                        )
                        cleanLine = line.substring(line.indexOf("]") + 1).trim()
                    }
                    function extractBetween(
                        start: string,
                        end: string,
                        where: string
                    ) {
                        choiceObject.text = cleanLine
                            .substring(0, cleanLine.indexOf(start) - 1)
                            .trim()
                        choiceObject[where] = cleanLine.substring(
                            cleanLine.indexOf(start) + 1,
                            cleanLine.indexOf(end)
                        )
                    }
                    if (cleanLine.includes("(") && !cleanLine.includes("{")) {
                        extractBetween("(", ")", "nextSceneName")
                    } else if (
                        cleanLine.includes("{") &&
                        !cleanLine.includes("(")
                    ) {
                        extractBetween("{", "}", "choiceEvents")
                    } else if (
                        cleanLine.includes("{") &&
                        cleanLine.includes("(")
                    ) {
                        extractBetween("{", "}", "choiceEvents")
                        extractBetween("(", ")", "nextSceneName")
                    } else {
                        choiceObject.text = cleanLine
                    }
                    step.choices.push(choiceObject)

                    if (lineArray.length != index + 1) return
                    else {
                        createChoiceStep()
                        return
                    }
                }
                // here create two steps at the same time (after choices)
                createChoiceStep()
                step.text = line
                step.images = images
                this.steps[file_name].push(_.cloneDeep(step))
            })
        })

        LOOP.add(() => {
            if (!GAME_STATE.echo.scene) return
            this.updateData()
        }, "SCENE.echo")
        EVENTS.on("startScene", (options) => {
            if (!options.name) return
            GAME_STATE.set("scene")
            this.echo.name = options.name
            this.echo.nextSceneName = options.name // used each continue
            this.echo.stepIndex = 0
            if (options.instantChoices) {
                TIME.run_after_iterations(() => EVENTS.emitSingle("continue"))
            }
        })
        EVENTS.onSingle("skipScene", () => {
            if (this.echo.name === "a0-adult-check") return
            EVENTS.emitSingle("endScene")
        })
        EVENTS.onSingle("endScene", () => {
            if (!PROGRESS.scenes.includes(this.echo.name.split("-")[0])) {
                PROGRESS.scenes.push(this.echo.name.split("-")[0])
            }
            HERO.reset_destination()
            SAVE.update()
            GAME_STATE.set("world")
            setTimeout(() => (this.echo.name = ""), 1000)
        })
        EVENTS.onSingle("resolveAdultCheckEndScene", () => {
            if (!PROGRESS.scenes.includes("n1")) {
                if (!PROGRESS.scenes.includes(this.echo.name.split("-")[0])) {
                    PROGRESS.scenes.push(this.echo.name.split("-")[0])
                }
                SAVE.update()
                GAME_STATE.set("empty")
                TIME.run_after(() => {
                    this.echo.name = "" // some styling binded to scene name
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
            if (this.echo.showChoiceBox) return // handled by direct click event on choice
            if (INTERFACE.skipHover || INTERFACE.buttonHover) return
            else EVENTS.emitSingle("continue")
        })
        EVENTS.onSingle("continue", () => {
            if (
                this.echo.lastContinueMS + CONFIG.scene.skipDelay >
                LOOP.elapsed
            )
                return
            this.echo.lastContinueMS = LOOP.elapsed
            const steps = this.getSteps()
            if (!steps) return
            const { step, nextStep } = steps
            this.runChoiceEvent(step)
            if ((nextStep && nextStep.choices.length === 0) || !nextStep) {
                this.echo.showChoiceBox = false
            } else {
                // prevent quick appearance on first time
                setTimeout(() => (this.echo.showChoiceBox = true), 10)
                const layerOne = this.echo.layerOne as AnyObject
                const layerTwo = this.echo.layerTwo as AnyObject
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
                this.echo.focusedChoiceIndex = possibleIndex
            }
            if (
                step.choices.length > 0 &&
                this.echo.focusedChoiceIndex === null
            )
                return
            if (nextStep) {
                if (nextStep.text !== step.text) this.echo.showText = false
                let delay = 50
                if (!_.isEqual(step.images, nextStep.images)) {
                    delay = CONFIG.scene.transitionSpeed * 0.5
                    this.echo.activeLayer = "layerTwo"
                    setTimeout(() => {
                        this.echo.activeLayer = "layerOne"
                    }, delay)
                }
                setTimeout(() => {
                    this.echo.showText = true
                    this.echo.stepIndex++
                }, delay)
            }
            if (
                this.echo.name === this.echo.nextSceneName ||
                !this.echo.nextSceneName
            ) {
                if (
                    this.echo.stepIndex >=
                    SCENE.steps[this.echo.name].length - 1
                ) {
                    EVENTS.emitSingle("endScene")
                }
            } else {
                this.echo.stepIndex = -1
                this.echo.name = this.echo.nextSceneName
            }
        })
    }
    process() {
        SCENE.menu_scenes.forEach((menuScene) => {
            if (!LAST.sceneName) return
            if (LAST.sceneName === this.echo.name) return
            if (LAST.sceneName.includes(menuScene)) {
                this.echo.leaveMenuMS = LOOP.elapsed
            }
        })
    }
    runChoiceEvent(step) {
        if (step.choices.length === 0) return
        if (!this.echo.focusedChoiceIndex) return
        let choiceEvents =
            step.choices[this.echo.focusedChoiceIndex].choiceEvents
        if (choiceEvents) {
            choiceEvents.split(",").forEach((s) => {
                EVENTS.emitSingle(s.trim())
            })
        }
    }
    getSteps() {
        if (!SCENE.steps[SCENE.echo.name]) return
        const step = SCENE.steps[SCENE.echo.name][SCENE.echo.stepIndex]
        if (!step) return
        let nextStep
        if (step.choices.length === 0) {
            nextStep = SCENE.steps[SCENE.echo.name][SCENE.echo.stepIndex + 1]
            return { step, nextStep }
        }
        if (!this.echo.focusedChoiceIndex) return
        SCENE.echo.nextSceneName =
            step.choices[this.echo.focusedChoiceIndex].nextSceneName
        if (
            !SCENE.echo.nextSceneName ||
            SCENE.echo.name === SCENE.echo.nextSceneName
        ) {
            nextStep = SCENE.steps[SCENE.echo.name][SCENE.echo.stepIndex + 1]
        } else {
            nextStep = SCENE.steps[SCENE.echo.nextSceneName][0]
        }
        return { step, nextStep }
    }
    updateData() {
        let layer, nextlayer
        layer = SCENE.echo.layerOne
        nextlayer = SCENE.echo.layerTwo
        const steps = this.getSteps()
        if (!steps) return
        const { step, nextStep } = steps
        this.updateLayerData(layer, step)
        if (nextStep) this.updateLayerData(nextlayer, nextStep)
    }
    updateLayerData(layer, step) {
        layer.images = step.images
        layer.text = step.text
        layer.x = SCENE.options[layer.images[0]]?.x || 950
        layer.y = SCENE.options[layer.images[0]]?.y || 620
        layer.hue = SCENE.options[layer.images[0]]?.hue || 0
        layer.brightness = SCENE.options[layer.images[0]]?.brightness || 1
    }
}
export const SCENE = LIBRARY.resonate(new Scene())
