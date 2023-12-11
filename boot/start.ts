export default defineNuxtPlugin(async (app) => {
    app.hook("app:mounted", () => start())
})
async function start() {
    if (!REFS.viewport) {
        LIBRARY.logWarning("viewport not found (starter)")
        return
    }
    if (process.env.NODE_ENV == "development") GLOBAL.devMode = true

    // right click menu off
    document.addEventListener("contextmenu", (event) => event.preventDefault())

    await initModules()

    await CREATOR.create("mousepoint")
    checkGesture()

    if (!PROGRESS.scenes.includes("a0")) {
        EVENTS.emit("startScene", {
            name: "a0-adult-check",
            instantChoices: true,
        })
        setTimeout(() => (GLOBAL.loading = false), 250)
    } else if (!PROGRESS.scenes.includes("n1")) {
        // timeout to make transition work
        EVENTS.emit("startScene", { name: "n1-start" })
        setTimeout(() => (GLOBAL.loading = false), 250)
    } else {
        // timeout to make transition work
        GAME_STATE.set("world")
        setTimeout(() => (GLOBAL.loading = false), 1)
    }
}
async function initModules() {
    CONFIG.init() // prepare priority
    const processes: { [name: string]: () => void } = {}
    const sortedPriority = LIBRARY.sortedKeys(CONFIG.priority.modulesInit)
    for (const name of sortedPriority) {
        const module = globalThis[name]
        if (module.init) await module.init()
        if (module.process) processes[name] = () => module.process()
    }
    // add processes after init, may depend on other init
    _.forEach(processes, (process, name) => {
        LOOP.add(() => process(), name)
    })
}
function checkGesture() {
    const listener = () => {
        GLOBAL.firstUserGesture = true
        removeEventListener("keydown", listener)
        removeEventListener("mousedown", listener)
    }
    addEventListener("keydown", listener)
    addEventListener("mousedown", listener)
}
