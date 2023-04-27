class Cache {
  public lastTick: any = {}

  public initialize() {
    gpm.app?.ticker.add(
      () => {
        this.lastTick = {
          heroInstance: _.cloneDeep(gef.heroInstance),
          entityInstances: glib.cloneMapDeep(gef.entityInstances),
        }
      },
      null,
      1
    )
  }
}
export const gcache = new Cache()
