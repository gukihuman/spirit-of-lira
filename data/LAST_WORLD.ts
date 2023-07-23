//
class LastWorld {
  //
  entities: Map<number, any> = new Map()
  hero: AnyObject = {}
  hover: AnyObject = {}

  init() {
    //
    WORLD.loop.add(() => {
      //
      this.entities = LIB.cloneMapDeep(WORLD.entities)
      this.hero = _.cloneDeep(WORLD.hero)
      this.hover = _.cloneDeep(WORLD.hover)
      //
    }, "LAST_WORLD")
  }
}

export const LAST_WORLD = new LastWorld()
