class Flipper {
  public initialize() {
    gpm.app?.ticker.add(
      () => {
        gef.instanciatedEntities.forEach((entity, id) => {
          const previousX = gcache.previuosTick.instanciatedEntities.get(id).x
          const entityContainer = gpm.findEntityContainer(id)
          if (entity.x < previousX) {
            if (entityContainer) entityContainer.scale.x = -1
          } else if (entity.x > previousX) {
            if (entityContainer) entityContainer.scale.x = 1
          }
          // 📜 add attack target dependence
        })
      },
      null,
      -1
    )
  }
}

export const gflip = new Flipper()
