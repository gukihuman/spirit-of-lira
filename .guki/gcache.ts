class Cache {
  entities: Map<number, any> = new Map()

  public init() {
    gpixi.tickerAdd(() => {
      this.entities = glib.cloneMapDeep(gworld.entities)
    }, "gcache")
  }
}
export const gcache = new Cache()
