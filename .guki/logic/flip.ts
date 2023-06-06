class Flip {
  init() {
    PIXI_GUKI.tickerAdd(() => {
      WORLD.entities.forEach((entity, id) => {
        if (!entity.alive) return
        if (PIXI_GUKI.elapsedMS - entity.alive.lastFlipMS < 200) return

        if (!CACHE.entities.get(id)) return
        const previousX = CACHE.entities.get(id).position.x
        const container = PIXI_GUKI.getContainer(id)
        if (!container) return

        if (entity.position.x < previousX) {
          container.scale.x = -1
          entity.alive.lastFlipMS = PIXI_GUKI.elapsedMS
        } else if (entity.position.x > previousX) {
          container.scale.x = 1
          entity.alive.lastFlipMS = PIXI_GUKI.elapsedMS
        }

        // 📜 add attack target dependence
        if (entity.alive.targetEntityId && entity.alive.targetAttacked) {
          const targetEntity = WORLD.entities.get(entity.alive.targetEntityId)
          if (targetEntity.position.x < entity.position.x) {
            container.scale.x = -1
            entity.alive.lastFlipMS = PIXI_GUKI.elapsedMS
          } else if (targetEntity.position.x > entity.position.x) {
            container.scale.x = 1
            entity.alive.lastFlipMS = PIXI_GUKI.elapsedMS
          }
        }
      })
    }, "FLIP")
  }
}

export const FLIP = new Flip()
