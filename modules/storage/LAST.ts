class Last {
  entities: Map<number, any> = new Map()
  hero: AnyObject = {}
  hover: AnyObject = {}
  scenePart: string = ""
  loopSec: number = -1
  init() {
    WORLD.loop.add(() => {
      this.entities = LIB.cloneMapDeep(WORLD.entities)
      this.hero = _.cloneDeep(WORLD.hero)
      this.hover = _.cloneDeep(WORLD.hover)
      this.scenePart = ACTIVE_SCENE.part
      this.loopSec = WORLD.loop.elapsedSec
    }, "LAST")
  }
}
export const LAST = new Last()
