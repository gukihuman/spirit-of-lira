class Last {
  entities: Map<number, any> = new Map()
  hero: AnyObject = {}
  hover: AnyObject | null = {}
  scenePart = ""
  sceneName = ""
  loopSec = -1
  context = ""
  settingsTabIndex = 0
  init() {
    LOOP.add(() => {
      this.entities = LIBRARY.cloneMapDeep(WORLD.entities)
      this.hero = _.cloneDeep(SH.hero)
      this.hover = _.cloneDeep(WORLD.hover)
      this.scenePart = ACTIVE_SCENE.part
      this.sceneName = ACTIVE_SCENE.name
      this.loopSec = LOOP.elapsedSec
      this.settingsTabIndex = SETTINGS.echo.tabIndex
      if (
        (GLOBAL.context === "scene" && LAST.context !== "scene") ||
        (GLOBAL.context !== "scene" && LAST.context === "scene")
      ) {
        EVENTS.emitSingle("sceneContextChanged")
      }
      this.context = GLOBAL.context
    }, "LAST")
  }
}
export const LAST = new Last()
