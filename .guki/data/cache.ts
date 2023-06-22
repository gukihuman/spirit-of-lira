class Cache {
  entities: Map<number, any> = new Map()

  init() {
    GPIXI.tickerAdd(() => {
      this.entities = LIB.cloneMapDeep(WORLD.entities)
      REACTIVE.world.lastHero = this.entities.get(REACTIVE.world.heroId)
    }, "CACHE")
  }
}
export const CACHE = new Cache()
