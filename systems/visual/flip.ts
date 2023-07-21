export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      if (WORLD.loop.elapsedMS - entity.sprite.flipMS < 200) return

      if (!WORLD.systems.lasttick.entities.get(id)) return
      const previousX = WORLD.systems.lasttick.entities.get(id).position.x
      const container = WORLD.getContainer(id)
      if (!container) return

      // exclude effect
      const back = WORLD.getLayer(id, "back")
      const middle = WORLD.getLayer(id, "middle")
      const front = WORLD.getLayer(id, "front")
      if (!back || !middle || !front) return
      const containers = [back, middle, front]

      // move
      if (entity.position.x < previousX) {
        containers.forEach((container) => (container.scale.x = -1))
        entity.sprite.flipMS = WORLD.loop.elapsedMS
      } else if (entity.position.x > previousX) {
        containers.forEach((container) => (container.scale.x = 1))
        entity.sprite.flipMS = WORLD.loop.elapsedMS
      }

      // attack target
      if (entity.target.id && entity.target.attacked) {
        const targetEntity = WORLD.entities.get(entity.target.id)
        if (targetEntity.position.x < entity.position.x) {
          containers.forEach((container) => (container.scale.x = -1))
          entity.sprite.flipMS = WORLD.loop.elapsedMS
        } else if (targetEntity.position.x > entity.position.x) {
          containers.forEach((container) => (container.scale.x = 1))
          entity.sprite.flipMS = WORLD.loop.elapsedMS
        }
      }
    })
  }
}
