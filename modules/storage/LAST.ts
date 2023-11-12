class Last {
  entities: Map<number, any> = new Map()
  hero: AnyObject = {}
  hover: AnyObject | null = {}
  scenePart = ""
  loopSec = -1
  context = ""
  init() {
    LOOP.add(() => {
      this.entities = LIBRARY.cloneMapDeep(WORLD.entities)
      this.hero = _.cloneDeep(SH.hero)
      this.hover = _.cloneDeep(WORLD.hover)
      this.scenePart = ACTIVE_SCENE.part
      this.loopSec = LOOP.elapsedSec
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
