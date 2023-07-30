export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      if (WORLD.loop.elapsedMS - entity.sprite.lastFlipMS < 200) return

      if (!LAST_WORLD.entities.get(id)) return
      const previousX = LAST_WORLD.entities.get(id).position.x
      const container = WORLD.getContainer(id)
      if (!container) return

      const layerNames = ["backWeapon", "main", "clothes", "frontWeapon"]
      const layersToFlip: any[] = []

      layerNames.forEach((layerName) => {
        //
        const layer = WORLD.getLayer(id, layerName)
        if (!layer) return
        layersToFlip.push(layer)
      })

      // move
      if (entity.position.x < previousX) {
        //
        layersToFlip.forEach((layer) => (layer.scale.x = -1))
        entity.sprite.lastFlipMS = WORLD.loop.elapsedMS
        //
      } else if (entity.position.x > previousX) {
        //
        layersToFlip.forEach((layer) => (layer.scale.x = 1))
        entity.sprite.lastFlipMS = WORLD.loop.elapsedMS
      }

      // attack target
      if (entity.target.id && entity.target.attacked) {
        //
        const targetEntity = WORLD.entities.get(entity.target.id)

        if (targetEntity.position.x < entity.position.x) {
          //
          layersToFlip.forEach((container) => (container.scale.x = -1))
          entity.sprite.lastFlipMS = WORLD.loop.elapsedMS
          //
        } else if (targetEntity.position.x > entity.position.x) {
          //
          layersToFlip.forEach((container) => (container.scale.x = 1))
          entity.sprite.lastFlipMS = WORLD.loop.elapsedMS
        }
      }
    })
  }
}
