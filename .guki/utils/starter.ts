export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())
  async function startApp() {
    if (!gsd.refs.viewport) return

    // some tools init may depend on devMode, set it first
    useCookie("name").value = useCookie("name").value || "default"
    if (useCookie("name").value == "guki") gsd.states.devMode = true

    // everything depend on gpixi ticker, init it first
    gpixi.init(gsd.refs.viewport)

    gic.init(gsd.refs.viewport) // input controller
    gcache.init()
    gflip.init() // flips containers horizontally
    gcm.init() // collision editor
    // grc.init() // remote controller
    gsignal.init()
    gud.init() // user data
    gdev.init()

    // 📜 maybe make a separate tool for hero creating
    gsd.states.heroId = await gef.createEntity("lira", {
      position: { x: 51000, y: 54000 },
    })

    // for (let i in _.range(40)) {
    //   await oldGef.instanceEntity("bunbo")
    // }

    // depend on hero instance for its coordinates init it last
    await gmm.init() // map manager

    gpixi.tickerAdd(() => gic.update(), "gic")

    gcs.systems.forEach((systemClass, name) => {
      const system = new systemClass()
      gpixi.tickerAdd(() => system.process(), name)
      gworld.systems.set(name, system)
    })

    // 📜 somehow try to get mouse position on start

    gsd.states.loadingScreen = false
  }
})
