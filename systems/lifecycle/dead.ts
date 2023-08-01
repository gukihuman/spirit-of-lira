export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.attributes) return
      if (entity.attributes.health <= 0) {
        entity.state.dead = true
        // 📜 make entity and locked be connected to id, to make undefined only
        entity.target.id = undefined
        entity.target.locked = undefined
        const animation = SPRITE.getLayer(id, "animation")
        const shadow = SPRITE.getLayer(id, "shadow")
        if (!animation || !shadow) return
        // fade
        const timeTillRemove =
          entity.state.lastChangeMS +
          entity.state.deadTimeMS -
          WORLD.loop.elapsedMS
        animation.alpha = timeTillRemove / 500
        if (timeTillRemove < 500) {
          entity.position.y += 0.5 * (60 / WORLD.loop.fps)
        }
        // 0.08 is defaul shadow alpha
        shadow.alpha = (timeTillRemove / 500) * 0.08
      }
    })
  }
}
