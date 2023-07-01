class Cache {
  entities: Map<number, any> = new Map()

  init() {
    GPIXI.tickerAdd(() => {
      this.entities = LIB.cloneMapDeep(WORLD.entities)
      SYSTEM_DATA.world.lastHero = this.entities.get(SYSTEM_DATA.world.heroId)
    }, "CACHE")
  }
}
export const CACHE = new Cache()
