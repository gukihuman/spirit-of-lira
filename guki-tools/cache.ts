class Cache {
  public previuosTick: any = {}

  public initialize() {
    gpm.app?.ticker.add(
      () => {
        const clonedInstanciatedEntities = new Map()
        gef.instanciatedEntities.forEach((value, key) => {
          clonedInstanciatedEntities.set(key, _.cloneDeep(value))
        })

        this.previuosTick = {
          instanciatedHero: _.cloneDeep(gef.instanciatedHero),
          instanciatedEntities: clonedInstanciatedEntities,
        }
      },
      null,
      1
    )
  }
}
export const gcache = new Cache()
