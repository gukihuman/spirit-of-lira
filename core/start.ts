export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())
  async function startApp() {
    if (!REFS.viewport) {
      LIB.logWarning("viewport not found (starter)")
      return
    }
    // set devMode, set it first cuz some tools init may depend on it
    useCookie("name").value = useCookie("name").value || "default"
    if (useCookie("name").value == "guki") GLOBAL.devMode = true
    // first to init
    CONFIG.init()
    // everything depend on WORLD ticker, init it right after CONFIG
    WORLD.init(REFS.viewport, CONFIG.viewport.width, CONFIG.viewport.height)
    // hero creation
    let heroId = await ENTITY_FACTORY.create("lira")
    if (!heroId) {
      LIB.logWarning("hero is not created (starter)")
      return
    }
    WORLD.hero = WORLD.entities.get(heroId)
    WORLD.heroId = heroId
    // likely depend on WORLD and/or hero
    EVENTS.init()
    LAST_WORLD.init()
    SETTINGS.init()
    LOCAL.init() // local storage
    INVENTORY.init()
    INTERFACE.init()
    EFFECTS.init()
    GLOBAL.init()
    SCENE.init()
    // 📜 change dependency of hero
    REMOTE.init() // uses hero for now
    await ENTITY_FACTORY.create("mousepoint")
    // right click menu off
    document.addEventListener("contextmenu", (event) => event.preventDefault())
    await setupSystems()
    // 📜 move to static entity handler to remove and spawn depending
    // on current loaded chunks
    await ENTITY_FACTORY.create("magic-tree", { sprite: {} })
    await ENTITY_FACTORY.create("bridge-fence", { sprite: {} })
    await ENTITY_FACTORY.create("bunny", { sprite: {} })
    // timeout to make sure initial loading transition will work
    setTimeout(() => {
      GLOBAL.loading = false
    }, 0)
  }
})
async function setupSystems() {
  const inits: Promise<void>[] = []
  const processes: { [name: string]: () => void } = {}
  const sortedPriority = LIB.sortedKeys(CONFIG.priority.systemInit)
  sortedPriority.forEach((name) => {
    const systemClass = MODELS.systems[name]
    if (!systemClass) return
    const system = new systemClass()
    if (system.init) inits.push(system.init())
    processes[name] = () => system.process()
    WORLD.systems[name] = system
  })
  await Promise.all(inits)
  // processes added later, may depend on init
  _.forEach(processes, (process, name) => {
    WORLD.loop.add(() => process(), name)
  })
}
