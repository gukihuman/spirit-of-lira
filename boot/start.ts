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
  await ENTITY_FACTORY.create("mousepoint")
  // right click menu off
  document.addEventListener("contextmenu", (event) => event.preventDefault())
  // 📜 move to static entity handler to remove and spawn depending
  // on current loaded chunks
  await ENTITY_FACTORY.create("magic-tree", { sprite: {} })
  await ENTITY_FACTORY.create("bridge-fence", { sprite: {} })
  await ENTITY_FACTORY.create("bunny", { sprite: {} })
  // 📜 handle this scene emit by some user data
  // EVENTS.emit("startScene", { name: "s1-start" })
  // timeout to make sure initial loading transition will work
  setTimeout(() => (GLOBAL.loading = false), 1)
}
async function initModules() {
  CONFIG.init() // prepare priority
  const inits: Promise<void>[] = []
  const processes: { [name: string]: () => void } = {}
  const sortedPriority = LIB.sortedKeys(CONFIG.priority.modulesInit)
  sortedPriority.forEach((name) => {
    const module = globalThis[name][name]
    if (module.init) inits.push(module.init())
    if (module.process) processes[name] = () => module.process()
  })
  await Promise.all(inits)
  // add processes after init, may depend on it
  _.forEach(processes, (process, name) => {
    WORLD.loop.add(() => process(), name)
  })
}
