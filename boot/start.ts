export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => start())
})
async function start() {
  if (!REFS.viewport) {
    LIB.logWarning("viewport not found (starter)")
    return
  }
  // set devMode, set it first cuz some tools init may depend on it
  useCookie("name").value = useCookie("name").value || "default"
  if (useCookie("name").value == "guki") GLOBAL.devMode = true
  // everything depend on WORLD ticker, init it right after CONFIG
  await initModules()
  // right click menu off
  document.addEventListener("contextmenu", (event) => event.preventDefault())
  // 📜 handle this scene emit by some user data
  // EVENTS.emit("startScene", { name: "s1-start" })
  // timeout to make sure initial loading transition will work
  setTimeout(() => (GLOBAL.loading = false), 1)
}
async function initModules() {
  CONFIG.init() // prepare priority
  const processes: { [name: string]: () => void } = {}
  const sortedPriority = LIB.sortedKeys(CONFIG.priority.modulesInit)
  for (const name of sortedPriority) {
    const module = globalThis[name][name]
    if (module.init) await module.init()
    if (module.process) processes[name] = () => module.process()
  }
  // add processes after init, may depend on other init
  _.forEach(processes, (process, name) => {
    WORLD.loop.add(() => process(), name)
  })
}
