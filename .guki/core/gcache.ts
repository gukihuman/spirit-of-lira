class Cache {
  entities: Map<number, any> = new Map()

  init() {
    gpixi.tickerAdd(() => {
      this.entities = glib.cloneMapDeep(gworld.entities)

      gg.lastHero = this.entities.get(gg.heroId)
    }, "gcache")
  }
}
export const gcache = new Cache()
