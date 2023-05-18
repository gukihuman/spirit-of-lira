export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())
  async function startApp() {
    if (!gsd.refs.viewport) return

    // set devMode, set it first cuz some tools init may depend on it
    useCookie("name").value = useCookie("name").value || "default"
    if (useCookie("name").value == "guki") gsd.states.devMode = true

    // everything depend on gpixi ticker, init it first
    gpixi.init(gsd.refs.viewport)

    gic.init(gsd.refs.viewport) // input controller
    gcache.init()
    gflip.init() // flips containers horizontally
    gcm.init() // collision editor
    // gremote.init() // remote controller
    gsignal.init()
    gud.init() // user data
    gdev.init()
    glocal.init()

    gsd.states.heroId = await gef.createEntity("lira", {
      position: { x: 51000, y: 54000 },
    })
    await gef.createEntity("mousemove")

    // depend on hero instance
    await gmm.init() // map manager
    await gil.init() // item loader

    // gic setup
    gpixi.tickerAdd(() => {
      gic.update()
      if (!gsd.states.firstMouseMove) {
        if (gic.mouse.x !== 0 || gic.mouse.y !== 0) {
          gsd.states.firstMouseMove = true
        }
      }
    }, "gic")

    // handle systems
    const inits: Promise<void>[] = []
    const processes: { [name: string]: () => void } = {}
    gstorage.systems.forEach((systemClass, name) => {
      const system = new systemClass()
      if (system.init) inits.push(system.init())
      processes[name] = () => system.process()
      gworld.systems.set(name, system)
    })
    await Promise.all(inits)

    // processes added later, cuz may depend on init
    _.forEach(processes, (process, name) => {
      gpixi.tickerAdd(() => process(), name)
    })

    gsd.states.loadingScreen = false
  }
})
