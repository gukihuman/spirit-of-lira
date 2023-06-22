export default defineNuxtPlugin(async (app) => {
  app.hook("app:mounted", () => startApp())
  async function startApp() {
    if (!REACTIVE.refs.viewport) {
      LIB.logWarning("viewport not found (starter)")
      return
    }

    // set devMode, set it first cuz some tools init may depend on it
    useCookie("name").value = useCookie("name").value || "default"
    if (useCookie("name").value == "guki") REACTIVE.states.devMode = true

    CONFIG.init()

    // everything depend on GPIXI ticker, init it right after CONFIG
    GPIXI.init(
      REACTIVE.refs.viewport,
      CONFIG.viewport.width,
      CONFIG.viewport.height
    )

    // tools that are likely depend on GPIXI ticker
    INPUT.init(REACTIVE.refs.viewport) // input controller
    CACHE.init()
    COLLISION.init()
    SIGNAL.init()
    USER_DATA.init()
    DEV_MODE.init()
    LOCAL.init() // local storage
    // REMOTE.init() // remote controller

    // hero creation
    let heroId = await ENTITY_FACTORY.createEntity("lira", {
      position: { x: 51000, y: 54000 },
    })
    if (!heroId) {
      LIB.logWarning("hero is not created (starter)")
      return
    }
    REACTIVE.world.hero = WORLD.entities.get(heroId)
    REACTIVE.world.heroId = heroId

    await ENTITY_FACTORY.createEntity("mousepoint")

    // tools depend on hero instance
    await MAP.init() // map manager, needs hero coordinates to init
    await WORLD.init() // init systems, like spawn mobs

    // all tools setup itself in init, INPUT is third-party (guki) so setup here
    GPIXI.tickerAdd(() => {
      INPUT.update()

      // watch first mouse move (or double click)
      // to prevent movement to the 0 0 coordinates
      if (!REACTIVE.states.firstMouseMove) {
        if (INPUT.mouse.x !== 0 || INPUT.mouse.y !== 0) {
          REACTIVE.states.firstMouseMove = true
        }
      }
    }, "INPUT")

    // right click menu off
    document.addEventListener("contextmenu", (event) => event.preventDefault())

    // to make shure initial loading transition will work
    setTimeout(() => {
      REACTIVE.states.loadingScreen = false
    }, 0)
  }
})
