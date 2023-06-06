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

    // everything depend on PIXI_GUKI ticker, init it first
    PIXI_GUKI.init(SYSTEM_DATA.refs.viewport)

    // tools that are likely depend on PIXI_GUKI ticker
    INPUT.init(SYSTEM_DATA.refs.viewport) // input controller
    ENTITY_FACTORY.init()
    CACHE.init()
    FLIP.init() // flips containers horizontally
    COLLISION.init() // collision editor
    SIGNAL.init()
    USER_DATA.init() // user data
    DEV_MODE.init()
    LOCAL.init()
    // REMOTE.init() // remote controller

    // hero creation
    let heroId = await ENTITY_FACTORY.createEntity("lira", {
      position: { x: 51000, y: 54000 },
    })
    if (!heroId) {
      LIB.logWarning("hero is not created (starter)")
      return
    }
    GLOBAL.hero = WORLD.entities.get(heroId)
    GLOBAL.heroId = heroId

    await ENTITY_FACTORY.createEntity("mousepoint")

    // tools depend on hero instance
    await MAP.init() // map manager, needs hero coordinates to init
    await ITEM.init() // item loader
    await WORLD.init() // init systems, like spawn mobs

    // all tools setup itself in init, INPUT is third-party so setup here
    PIXI_GUKI.tickerAdd(() => {
      INPUT.update()

      // watch first mouse move (or double click)
      // to prevent movement to the 0 0 coordinates
      if (!SYSTEM_DATA.states.firstMouseMove) {
        if (INPUT.mouse.x !== 0 || INPUT.mouse.y !== 0) {
          SYSTEM_DATA.states.firstMouseMove = true
        }
      }
    }, "INPUT")

    // right click menu off
    document.addEventListener("contextmenu", (event) => event.preventDefault())

    SYSTEM_DATA.states.loadingScreen = false
  }
})
