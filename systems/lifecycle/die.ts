export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.attributes) return
      if (entity.attributes.health <= 0) {
        if (!entity.state.dead) {
          entity.time.durationMS = 1300
          entity.time.deathTimerStartMS = WORLD.loop.elapsedMS
        }

        entity.state.dead = true
        entity.target.id = undefined
        entity.target.entity = undefined
        entity.target.attacked = undefined
        entity.target.locked = undefined

        const animation = WORLD.getLayer(id, "animation")
        const shadow = WORLD.getLayer(id, "shadow")
        if (!animation || !shadow) return

        // fade
        const timeToRemove =
          entity.time.deathTimerStartMS +
          entity.time.durationMS -
          WORLD.loop.elapsedMS
        animation.alpha = timeToRemove / 500

        if (timeToRemove < 500) {
          // 📜 add support for higher fps, this works only for 60
          entity.position.y += 0.5
        }

        // shadow  handler, 0.08 is defaul
        shadow.alpha = (timeToRemove / 500) * 0.08
      }
    })
  }
}
