class Flip {
  public init() {
    gpixi.tickerAdd(() => {
      gef.entityInstances.forEach((entityInstance, id) => {
        if (!entityInstance.x || !entityInstance.y) return
        const previousX = gcache.lastTick.entityInstances.get(id).x
        const entityContainer = gpixi.getEntityContainer(id)
        if (entityInstance.x < previousX) {
          if (entityContainer) entityContainer.scale.x = -1
        } else if (entityInstance.x > previousX) {
          if (entityContainer) entityContainer.scale.x = 1
        }
        // 📜 add attack target dependence
      })
    }, "gflip")
  }
}

export const gflip = new Flip()
