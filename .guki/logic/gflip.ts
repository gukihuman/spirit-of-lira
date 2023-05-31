class Flip {
  init() {
    gpixi.tickerAdd(() => {
      gworld.entities.forEach((entity, id) => {
        if (!entity.alive) return
        if (gpixi.elapsedMS - entity.alive.lastFlipMS < 200) return

        if (!gcache.entities.get(id)) return
        const previousX = gcache.entities.get(id).position.x
        const container = gpixi.getContainer(id)
        if (!container) return

        if (entity.position.x < previousX) {
          container.scale.x = -1
          entity.alive.lastFlipMS = gpixi.elapsedMS
        } else if (entity.position.x > previousX) {
          container.scale.x = 1
          entity.alive.lastFlipMS = gpixi.elapsedMS
        }

        // 📜 add attack target dependence
        if (entity.alive.targetEntityId && entity.alive.targetAttacked) {
          const targetEntity = gworld.entities.get(entity.alive.targetEntityId)
          if (targetEntity.position.x < entity.position.x) {
            container.scale.x = -1
            entity.alive.lastFlipMS = gpixi.elapsedMS
          } else if (targetEntity.position.x > entity.position.x) {
            container.scale.x = 1
            entity.alive.lastFlipMS = gpixi.elapsedMS
          }
        }
      })
    }, "gflip")
  }
}

export const gflip = new Flip()
