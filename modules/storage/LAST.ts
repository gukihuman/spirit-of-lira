class Last {
  entities: Map<number, any> = new Map()
  hero: AnyObject = {}
  hover: AnyObject = {}
  scenePart: string = ""
  init() {
    WORLD.loop.add(() => {
      this.entities = LIB.cloneMapDeep(WORLD.entities)
      this.hero = _.cloneDeep(WORLD.hero)
      this.hover = _.cloneDeep(WORLD.hover)
      this.scenePart = ACTIVE_SCENE.part
    }, "LAST")
  }
}
export const LAST = new Last()
