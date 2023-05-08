class Cache {
  public lastTick: any = {}

  public init() {
    gpixi.tickerAdd(() => {
      this.lastTick = {
        heroInstance: _.cloneDeep(gef.heroInstance),
        entityInstances: glib.cloneMapDeep(gef.entityInstances),
      }
    }, "gcache")
  }
}
export const gcache = new Cache()
