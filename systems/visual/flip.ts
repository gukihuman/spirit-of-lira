export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      if (WORLD.loop.elapsedMS - entity.sprite.lastFlipMS < 200) return
      if (!LAST_WORLD.entities.get(id)) return
      const previousX = LAST_WORLD.entities.get(id).position.x
      const container = SPRITE.getContainer(id)
      if (!container) return
      let before = 1
      const layerNames = ["backWeapon", "animation", "cloth", "frontWeapon"]
      const layersToFlip: any[] = []
      layerNames.forEach((layerName) => {
        const layer = SPRITE.getLayer(id, layerName)
        if (!layer) return
        layersToFlip.push(layer)
        // take before from "animation" because all entities have it
        // other layers like "backWeapon" is the always the same
        if (layerName === "animation") before = layer.scale.x
      })
      // move
      if (entity.position.x < previousX) {
        layersToFlip.forEach((layer) => (layer.scale.x = -1))
      } else if (entity.position.x > previousX) {
        layersToFlip.forEach((layer) => (layer.scale.x = 1))
      }
      // attack target
      if (entity.target.id && entity.target.tracked) {
        const targetEntity = WORLD.entities.get(entity.target.id)
        if (targetEntity.position.x < entity.position.x) {
          layersToFlip.forEach((container) => (container.scale.x = -1))
        } else if (targetEntity.position.x > entity.position.x) {
          layersToFlip.forEach((container) => (container.scale.x = 1))
        }
      }
      if (SPRITE.getLayer(id, "animation")?.scale.x !== before) {
        entity.sprite.lastFlipMS = WORLD.loop.elapsedMS
      }
    })
  }
}
