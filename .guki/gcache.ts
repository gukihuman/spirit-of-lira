class Cache {
  entities: Map<number, any> = new Map()

  init() {
    gp.tickerAdd(() => {
      this.entities = glib.cloneMapDeep(gworld.entities)
    }, "gcache")
  }
}
export const gcache = new Cache()
