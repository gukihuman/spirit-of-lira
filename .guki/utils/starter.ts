import { getActivePinia } from "pinia"
import { GameWindow } from "~~/.nuxt/components"

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
    glocal.init()

    // 📜 make a separate tool that handles hero creation
    gsd.states.heroId = await gef.createEntity("lira", {
      position: { x: 51000, y: 54000 },
    })
    await gef.createEntity("mousemove")

    // depend on hero instance for its coordinates init it last
    await gmm.init() // map manager

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
    gs.systems.forEach((systemClass, name) => {
      const system = new systemClass()
      if (system.init) inits.push(system.init())
      processes[name] = () => system.process()
      gworld.systems.set(name, system)
    })
    await Promise.all(inits)

    _.forEach(processes, (process, name) => {
      gpixi.tickerAdd(() => process(), name)
    })

    // 📜 somehow try to get mouse position on start

    gsd.states.loadingScreen = false
  }
})
