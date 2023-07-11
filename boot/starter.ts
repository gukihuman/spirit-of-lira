export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())
  async function startApp() {
    if (!SYSTEM_DATA.refs.viewport) {
      LIB.logWarning("viewport not found (starter)")
      return
    }

    // set devMode, set it first cuz some tools init may depend on it
    useCookie("name").value = useCookie("name").value || "default"
    if (useCookie("name").value == "guki") SYSTEM_DATA.states.devMode = true

    // first to init
    CONFIG.init()

    // everything depend on GPIXI ticker, init it right after CONFIG
    GPIXI.init(
      SYSTEM_DATA.refs.viewport,
      CONFIG.viewport.width,
      CONFIG.viewport.height
    )

    // tools that are likely depend on GPIXI ticker
    SIGNAL.init()
    USER_DATA.init()
    LOCAL.init() // local storage

    // hero creation
    let heroId = await ENTITY_FACTORY.create("lira")
    if (!heroId) {
      LIB.logWarning("hero is not created (starter)")
      return
    }
    SYSTEM_DATA.world.hero = ENTITIES.get(heroId)
    SYSTEM_DATA.world.heroId = heroId

    await ENTITY_FACTORY.create("mousepoint")

    // 📜 change dependency of hero
    REMOTE.init() // uses hero for now

    // right click menu off
    document.addEventListener("contextmenu", (event) => event.preventDefault())

    await setupSystems()

    GPIXI.tickerAdd(() => {
      ENTITIES.forEach((entity, id) => {
        if (entity.process) entity.process(entity, id)
      })
    }, "ENTITIES")

    // 📜 move to static entity handler to remove and spawn depending
    // on current loaded chunks
    ENTITY_FACTORY.create("magic-tree")
    ENTITY_FACTORY.create("bridge-fence")
    ENTITY_FACTORY.create("bunny")

    // to make sure initial loading transition will work
    setTimeout(() => {
      SYSTEM_DATA.states.loadingScreen = false
    }, 0)
  }
})

// 📜 implement dynamic system process, allowing adding and removing systems
// now its just init everything at the start
async function setupSystems() {
  const inits: Promise<void>[] = []
  const processes: { [name: string]: () => void } = {}
  const sortedPriority = LIB.sortedKeys(CONFIG.priority.systemInit)

  sortedPriority.forEach((name) => {
    const systemClass = IMPORTS.systems.get(name)
    if (!systemClass) return

    const system = new systemClass()
    if (system.init) inits.push(system.init())
    processes[name] = () => system.process()
    SYSTEMS[name] = system
  })
  await Promise.all(inits)

  // processes added later, may depend on init
  _.forEach(processes, (process, name) => {
    GPIXI.tickerAdd(() => process(), name)
  })
}

export const SYSTEMS: { [name: string]: any } = {}
export const ENTITIES: Map<number, any> = new Map()
