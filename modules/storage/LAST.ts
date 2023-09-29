class Last {
  entities: Map<number, any> = new Map()
  hero: AnyObject = {}
  hover: AnyObject = {}
  scenePart: string = ""
  loopSec: number = -1
  context: string = ""
  init() {
    WORLD.loop.add(() => {
      this.entities = LIB.cloneMapDeep(WORLD.entities)
      this.hero = _.cloneDeep(WORLD.hero)
      this.hover = _.cloneDeep(WORLD.hover)
      this.scenePart = ACTIVE_SCENE.part
      this.loopSec = WORLD.loop.elapsedSec
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
