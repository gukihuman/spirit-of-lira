declare global {
    type Condition = {
        getText: () => string
        getCondition: () => boolean
    }
}
type PlainTextsObject = { [md_file_name: string]: string }
interface Echo extends AnyObject {
    focusedChoiceIndex: number | null
}
interface sceneConditions extends AnyObject {
    [tag: string]: Condition
}
type StyleAdjustmentsByWebp = { [webp_file_name: string]: StyleAdjustments }
type StyleAdjustments = {
    x?: number
    y?: number
    hue?: number
    brightness?: number
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
type Steps = { [md_file_name: string]: Step[] }
type Step = {
    images: string[]
    text: ""
    choices: ChoiceObject[]
}
type ChoiceObject = {
    text?: string
    nextSceneName?: string
    choiceEvents?: string // events separated by comma like "event1, event2"
    arrow?: boolean
    bulb?: boolean
    bulbScene?: string
}
class Novel {
    menu_scenes: string[] = []
    mds_plain_texts: PlainTextsObject = {}
    mds_steps: Steps = {}
    style_adjustments_by_webp: StyleAdjustmentsByWebp = {
        a0: { x: 610, y: 750, brightness: 1.1 }, // 📜 remove blank dependence
        "n1-lira-no-light": { hue: -30 },
        "n1-lira-arms-down": { hue: -30 },
        "n1-lira-arms-raised": { hue: -30 },
        "n1-nighty": { x: 370, y: 700 },
        "n1-nighty-close": { x: 950 },
    }
    sceneConditions: sceneConditions = {
        b1: {
            getText: () => `Kill bunbos ${PROGRESS.mobs.bunbo} / 20`,
            getCondition: () => PROGRESS.mobs.bunbo >= 20,
        },
    }
    echo: Echo = {
        active_md: "",
        active_scene: "",
        active_girl: "",
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
    last = { echo: this.echo }
    async init() {
        for (const md_file_name in ASSETS.md_paths) {
            const tag = md_file_name.split("-")[0]
            if (tag === "a0") continue
            if (tag.includes("0")) this.menu_scenes.push(tag)
        }

        for (const [md_file_name, path] of _.entries(ASSETS.md_paths)) {
            const response = await fetch(path)
            this.mds_plain_texts[md_file_name] = await response.text()
        }

        _.forEach(this.mds_plain_texts, (value, md_file_name) => {
            this.mds_steps[md_file_name] = []
            let lineArray
            if (value.includes("\r\n")) {
                lineArray = value.split("\r\n")
            } else {
                lineArray = value.split("\n") // for vercel environment
            }
            let images: string[] = []
            const step: Step = {
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
                        this.mds_steps[md_file_name].push(_.cloneDeep(step))
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
                this.mds_steps[md_file_name].push(_.cloneDeep(step))
            })
        })
        LOOP.add(() => {
            if (CONTEXT.echo.novel) this.updateData()
        }, "NOVEL")
        EVENTS.on("startScene", (options) => {
            if (!options.name) return
            CONTEXT.echo.novel = true
            this.echo.active_md = options.name
            this.echo.nextSceneName = options.name // used each continue
            this.echo.stepIndex = 0
            if (options.instantChoices) {
                TIME.next(() => EVENTS.emitSingle("continue"))
            }
        })
        EVENTS.onSingle("skipScene", () => {
            if (this.echo.active_md === "a0") return
            EVENTS.emitSingle("endScene")
        })
        EVENTS.onSingle("endScene", () => {
            if (!PROGRESS.scenes.includes(this.echo.active_scene)) {
                PROGRESS.scenes.push(this.echo.active_scene)
            }
            HERO.reset_final_des()
            SAVE.update()
            CONTEXT.echo.novel = false
            setTimeout(() => (this.echo.active_md = ""), 1000)
        })
        EVENTS.onSingle("resolveAdultCheckEndScene", () => {
            if (!PROGRESS.scenes.includes("n1")) {
                if (!PROGRESS.scenes.includes(this.echo.active_scene)) {
                    PROGRESS.scenes.push(this.echo.active_scene)
                }
                SAVE.update()
                CONTEXT.echo.novel = false
                CONTEXT.echo.empty = true
                TIME.after(1000, () => (CONTEXT.echo.empty = false))
                TIME.after(500, () => {
                    this.echo.active_md = "" // styling need to be changed in between 1000 transition and it is binded to active_md
                    EVENTS.emit("startScene", { name: "n1-start" })
                })
            } else EVENTS.emitSingle("endScene")
        })
        EVENTS.onSingle("keepAdultCheck", () => {
            TIME.next(() => _.remove(PROGRESS.scenes, (s) => s === "a0"))
            SAVE.update()
        })
        EVENTS.onSingle("mouseContinue", () => {
            if (this.echo.showChoiceBox) return // handled by direct click event on choice
            if (INTERFACE.skipHover || INTERFACE.buttonHover) return
            else EVENTS.emitSingle("continue")
        })
        EVENTS.onSingle("continue", () => {
            if (
                this.echo.lastContinueMS + CONFIG.novel.skipDelay >
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
                        NOVEL.sceneConditions[choice.bulbScene]
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
                    delay = CONFIG.novel.transitionSpeed * 0.5
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
                this.echo.active_md === this.echo.nextSceneName ||
                !this.echo.nextSceneName
            ) {
                if (
                    this.echo.stepIndex >=
                    NOVEL.mds_steps[this.echo.active_md].length - 1
                ) {
                    EVENTS.emitSingle("endScene")
                }
            } else {
                this.echo.stepIndex = -1
                this.echo.active_md = this.echo.nextSceneName
            }
        })
    }
    process() {
        this.echo.active_scene = this.echo.active_md.split("-")[0]
        if (_.startsWith(this.echo.active_scene, "n")) {
            this.echo.active_girl = "nighty"
        } else if (_.startsWith(this.echo.active_scene, "b")) {
            this.echo.active_girl = "bunny"
        } else {
            this.echo.active_girl = ""
        }
        NOVEL.menu_scenes.forEach((menu_scene) => {
            if (!this.last.echo.active_scene) return
            if (this.last.echo.active_scene === this.echo.active_md) return
            if (this.last.echo.active_scene.includes(menu_scene)) {
                this.echo.leaveMenuMS = LOOP.elapsed
            }
        })
        if (this.echo.active_scene !== this.last.echo.active_scene) {
            EVENTS.emitSingle("active scene changed")
        }
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
        if (!NOVEL.mds_steps[NOVEL.echo.active_md]) return
        const step = NOVEL.mds_steps[NOVEL.echo.active_md][NOVEL.echo.stepIndex]
        if (!step) return
        let nextStep
        if (step.choices.length === 0) {
            nextStep =
                NOVEL.mds_steps[NOVEL.echo.active_md][NOVEL.echo.stepIndex + 1]
            return { step, nextStep }
        }
        if (this.echo.focusedChoiceIndex === null) return
        NOVEL.echo.nextSceneName =
            step.choices[this.echo.focusedChoiceIndex].nextSceneName
        if (
            !NOVEL.echo.nextSceneName ||
            NOVEL.echo.active_md === NOVEL.echo.nextSceneName
        ) {
            nextStep =
                NOVEL.mds_steps[NOVEL.echo.active_md][NOVEL.echo.stepIndex + 1]
        } else {
            nextStep = NOVEL.mds_steps[NOVEL.echo.nextSceneName][0]
        }
        return { step, nextStep }
    }
    updateData() {
        let layer, nextlayer
        layer = NOVEL.echo.layerOne
        nextlayer = NOVEL.echo.layerTwo
        const steps = this.getSteps()
        if (!steps) return
        const { step, nextStep } = steps
        this.updateLayerData(layer, step)
        if (nextStep) this.updateLayerData(nextlayer, nextStep)
    }
    updateLayerData(layer, step) {
        layer.images = step.images
        layer.text = step.text
        layer.x = NOVEL.style_adjustments_by_webp[layer.images[0]]?.x || 950
        layer.y = NOVEL.style_adjustments_by_webp[layer.images[0]]?.y || 620
        layer.hue = NOVEL.style_adjustments_by_webp[layer.images[0]]?.hue || 0
        layer.brightness =
            NOVEL.style_adjustments_by_webp[layer.images[0]]?.brightness || 1
    }
}

export const NOVEL = LIBRARY.resonate(new Novel())
