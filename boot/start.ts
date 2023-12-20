export default defineNuxtPlugin(async (app) => {
    app.hook("app:mounted", () => start())
})
async function start() {
    const loading_text_element = document.getElementById("loading-text")
    const loading_texts = ["loading", "loading.", "loading..", "loading..."]
    let loading_text_index = 0
    const loading_animation = setInterval(() => {
        loading_text_index = (loading_text_index + 1) % loading_texts.length
        const active_text = loading_texts[loading_text_index]
        if (loading_text_element) loading_text_element.innerText = active_text
    }, 300)

    if (!REFS.viewport) {
        LIBRARY.logWarning("viewport not found (starter)")
        return
    }
    if (process.env.NODE_ENV == "development") GLOBAL.dev_env = true

    // right click menu off
    document.addEventListener("contextmenu", (event) => event.preventDefault())

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

    await CREATOR.create("mousepoint")

    const listener = () => {
        GLOBAL.firstUserGesture = true
        removeEventListener("keydown", listener)
        removeEventListener("mousedown", listener)
    }
    addEventListener("keydown", listener)
    addEventListener("mousedown", listener)

    TIME.after(500, () => clearInterval(loading_animation))

    if (!PROGRESS.scenes.includes("a0")) {
        EVENTS.emit("startScene", {
            name: "a0",
            instantChoices: true,
        })
    } else if (!PROGRESS.scenes.includes("n1")) {
        EVENTS.emit("startScene", { name: "n1-start" })
    }

    // delay to make transition work
    TIME.next(() => (CONTEXT.echo.loading = false))
}
