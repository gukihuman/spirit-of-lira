export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())
  async function startApp() {
    if (!gsd.refs.viewport) return

    // some tools init may depend on devMode, set it first
    useCookie("name").value = useCookie("name").value || "default"
    if (useCookie("name").value == "guki") gsd.states.devMode = true

    // every init depend on gpixi ticker, init it before any other tool
    gpixi.init(gsd.refs.viewport)

    gsd.init() // system data
    gim.init() // input manager
    gcache.init() // caches previous iteration
    gflip.init() // flips containers horizontally
    gcm.init() // collision editor
    gud.init() // user data
    grc.init() // remote controller
    gsignal.init()

    // 📜 make a separate tool for entities instanciating
    await gef.instanceEntity("hero")
    for (let i in _.range(40)) {
      await gef.instanceEntity("bunbo")
    }

    // depend on hero instance for its coordinates init it last
    await gmm.init() // map manager

    gsd.states.loadingScreen = false
  }
})
