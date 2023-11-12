class Flip {
  process() {
    MUSEUM.processEntity(
      ["MOVE", "POSITION", "STATE", "TARGET"],
      (entity, id) => {
        if (entity.STATE.active === "dead") return
        if (WORLD.loop.elapsedMS - entity.SPRITE.lastFlipMS < 200) return
        if (!LAST.entities.get(id)) return
        const previousX = LAST.entities.get(id).POSITION.x
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
        if (entity.POSITION.x < previousX) {
          layersToFlip.forEach((layer) => (layer.scale.x = -1))
        } else if (entity.POSITION.x > previousX) {
          layersToFlip.forEach((layer) => (layer.scale.x = 1))
        }
        // attack target
        if (entity.TARGET.id && entity.STATE.track) {
          const targetEntity = WORLD.entities.get(entity.TARGET.id)
          if (targetEntity.POSITION.x < entity.POSITION.x) {
            layersToFlip.forEach((container) => (container.scale.x = -1))
          } else if (targetEntity.POSITION.x > entity.POSITION.x) {
            layersToFlip.forEach((container) => (container.scale.x = 1))
          }
        }
        if (SPRITE.getLayer(id, "animation")?.scale.x !== before) {
          entity.SPRITE.lastFlipMS = WORLD.loop.elapsedMS
        }
      }
    )
  }
}
export const FLIP = new Flip()
