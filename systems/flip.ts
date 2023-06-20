export default class flip {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      if (GPIXI.elapsedMS - entity.move.lastFlipMS < 200) return

      if (!CACHE.entities.get(id)) return
      const previousX = CACHE.entities.get(id).position.x
      const container = GPIXI.getMain(id)
      if (!container) return

      // move
      if (entity.position.x < previousX) {
        container.scale.x = -1
        entity.move.lastFlipMS = GPIXI.elapsedMS
      } else if (entity.position.x > previousX) {
        container.scale.x = 1
        entity.move.lastFlipMS = GPIXI.elapsedMS
      }

      // attack target
      if (entity.move.targetEntityId && entity.move.targetAttacked) {
        const targetEntity = WORLD.entities.get(entity.move.targetEntityId)
        if (targetEntity.position.x < entity.position.x) {
          container.scale.x = -1
          entity.move.lastFlipMS = GPIXI.elapsedMS
        } else if (targetEntity.position.x > entity.position.x) {
          container.scale.x = 1
          entity.move.lastFlipMS = GPIXI.elapsedMS
        }
      }
    })
  }
}
