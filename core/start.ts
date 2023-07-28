import { LAST_WORLD } from "~~/data/LAST_WORLD"

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

    // tools that are likely depend on WORLD ticker
    EVENTS.init()
    LAST_WORLD.init()
    SETTINGS.init()
    LOCAL.init() // local storage
    INTERFACE.init()

    // hero creation
    let heroId = await ENTITY_FACTORY.create("lira")
    if (!heroId) {
      LIB.logWarning("hero is not created (starter)")
      return
    }
    WORLD.hero = WORLD.entities.get(heroId)
    WORLD.heroId = heroId

    await ENTITY_FACTORY.create("mousepoint")

    // 📜 change dependency of hero
    REMOTE.init() // uses hero for now

    // right click menu off
    document.addEventListener("contextmenu", (event) => event.preventDefault())

    await setupSystems()

    WORLD.loop.add(() => {
      WORLD.entities.forEach((entity, id) => {
        if (entity.process) entity.process(entity, id)
      })
    }, "WORLD.entities")

    // 📜 move to static entity handler to remove and spawn depending
    // on current loaded chunks
    ENTITY_FACTORY.create("magic-tree")
    ENTITY_FACTORY.create("bridge-fence")
    ENTITY_FACTORY.create("bunny")

    // to make sure initial loading transition will work
    setTimeout(() => {
      GLOBAL.loadingScreen = false
    }, 0)
  }
})

async function setupSystems() {
  //
  const inits: Promise<void>[] = []
  const processes: { [name: string]: () => void } = {}
  const sortedPriority = LIB.sortedKeys(CONFIG.priority.systemInit)

  sortedPriority.forEach((name) => {
    const systemClass = MODELS.systems.get(name)
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
