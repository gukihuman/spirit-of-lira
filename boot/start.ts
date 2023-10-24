export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => start())
})
async function start() {
  if (!REFS.viewport) {
    LIB.logWarning("viewport not found (starter)")
    return
  }
  if (process.env.NODE_ENV == "development") GLOBAL.devMode = true

  // right click menu off
  document.addEventListener("contextmenu", (event) => event.preventDefault())

  // everything depend on WORLD ticker, init it right after CONFIG
  await initModules()

  await CREATOR.create("mousepoint")
  checkGesture()

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
function checkGesture() {
  const listener = () => {
    GLOBAL.firstUserGesture = true
    removeEventListener("keydown", listener)
    removeEventListener("mousedown", listener)
  }
  addEventListener("keydown", listener)
  addEventListener("mousedown", listener)
}
