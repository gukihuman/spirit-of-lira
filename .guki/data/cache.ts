class Cache {
  entities: Map<number, any> = new Map()

  init() {
    PIXI_GUKI.tickerAdd(() => {
      this.entities = LIB.cloneMapDeep(WORLD.entities)

      GLOBAL.lastHero = this.entities.get(GLOBAL.heroId)
    }, "CACHE")
  }
}
export const CACHE = new Cache()
