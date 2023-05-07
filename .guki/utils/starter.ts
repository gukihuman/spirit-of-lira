export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())

  async function startApp() {
    // set devMode before initialization of tools
    useCookie("name").value = useCookie("name").value || "default"
    if (useCookie("name").value == "guki") gsd.states.devMode = true
    //
    // init order is important, these are independent ones
    gpixi.init(gsd.refs.viewport) // pixi manager
    gic.initialize(gsd.refs.viewport) // input controller

    // depend on gpixi ticker, have to be init after gpixi
    gsd.init() // system data
    gim.init() // input manager
    gcache.init()
    gflip.init() // flip containers horizontally
    gcm.init() // collision editor
    gud.init() // user data
    grc.init() // remote controller

    // depend on gpixi
    await gef.instanceEntity("hero")

    // depend on gpixi and hero instance for its coordinates
    await gmm.init() // map manager

    for (let i in _.range(40)) {
      await gef.instanceEntity("bunbo")
    }

    gsd.states.assetsLoaded = true
  }
})
