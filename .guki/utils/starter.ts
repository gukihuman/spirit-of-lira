export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())
  async function startApp() {
    if (!gsd.refs.viewport) {
      glib.logWarning("viewport not found (starter)")
      return
    }

    // set devMode, set it first cuz some tools init may depend on it
    useCookie("name").value = useCookie("name").value || "default"
    if (useCookie("name").value == "guki") gsd.states.devMode = true

    // everything depend on gpixi ticker, init it first
    gpixi.init(gsd.refs.viewport)

    // tools that are likely depend on gpixi ticker
    gic.init(gsd.refs.viewport) // input controller
    gcache.init()
    gflip.init() // flips containers horizontally
    gcm.init() // collision editor
    gsignal.init()
    gud.init() // user data
    gdev.init()
    glocal.init()
    // gremote.init() // remote controller

    // hero creation
    let heroId = await gef.createEntity("lira", {
      position: { x: 51000, y: 54000 },
    })
    if (!heroId) {
      glib.logWarning("hero is not created (starter)")
      return
    }
    gconst.hero = gworld.entities.get(heroId)
    gconst.heroId = heroId
    await gef.createEntity("mousemove")

    // tools depend on hero instance
    await gmm.init() // map manager, needs hero coordinates to init
    await gitem.init() // item loader

    // all tools setup itself in init, gic is third-party so setup here
    gpixi.tickerAdd(() => {
      gic.update()

      // watch first mouse move (or double click)
      // to prevent movement to the 0 0 coordinates
      if (!gsd.states.firstMouseMove) {
        if (gic.mouse.x !== 0 || gic.mouse.y !== 0) {
          gsd.states.firstMouseMove = true
        }
      }
    }, "gic")

    // may depend on tools, like gmm for spawn mobs
    await setupSystems()

    gsd.states.loadingScreen = false
  }
})

async function setupSystems() {
  const inits: Promise<void>[] = []
  const processes: { [name: string]: () => void } = {}

  gstorage.systems.forEach((systemClass, name) => {
    const system = new systemClass()
    if (system.init) inits.push(system.init())
    processes[name] = () => system.process()
    gworld.systems.set(name, system)
  })
  await Promise.all(inits)

  // processes added later, may depend on init
  _.forEach(processes, (process, name) => {
    gpixi.tickerAdd(() => process(), name)
  })
}
