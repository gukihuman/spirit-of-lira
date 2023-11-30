class Last {
  entities: Map<number, any> = new Map()
  hero: AnyObject = {}
  hover: AnyObject | null = {}
  scenePart = ""
  sceneName = ""
  loopSec = -1
  settingsTabIndex = 0
  process() {
    for (const name of CONFIG.modules) {
      const module = globalThis[name]
      if (module.last) {
        _.keys(module.last).forEach((key) => {
          if (key === "echo") {
            // getOwnPropertyNams includes getters and setters
            const echoKeys = Object.getOwnPropertyNames(module.last.echo)
            echoKeys.forEach((echoKey) => {
              if (echoKey === "state") return
              module.last.echo[echoKey] = LIBRARY.clone(module.echo[echoKey])
            })
          } else {
            module.last[key] = LIBRARY.clone(module[key])
          }
        })
      }
    }
    // 📜 old ones, rework and remove :)
    this.entities = LIBRARY.clone(WORLD.entities)
    this.hero = _.cloneDeep(SH.hero)
    this.hover = _.cloneDeep(WORLD.hover)
    this.scenePart = ACTIVE_SCENE.part
    this.sceneName = ACTIVE_SCENE.name
    this.loopSec = LOOP.elapsedSec
    this.settingsTabIndex = SETTINGS.echo.tabIndex
    if (
      (CONTEXT.echo.scene && !CONTEXT.last.echo.scene) ||
      (!CONTEXT.echo.scene && CONTEXT.last.echo.scene)
    ) {
      EVENTS.emitSingle("sceneContextChanged")
    }
  }
}
export const LAST = new Last()
