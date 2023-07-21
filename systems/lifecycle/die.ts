export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.attributes) return
      if (entity.attributes.health <= 0) {
        if (!entity.state.dead) {
          entity.time.durationMS = 1300
          entity.time.deathTimerStartMS = WORLD.elapsedMS
        }

        entity.state.dead = true
        entity.target.id = undefined
        entity.target.entity = undefined
        entity.target.attacked = undefined
        entity.target.locked = undefined

        const middle = WORLD.getMiddle(id)
        const back = WORLD.getBack(id)
        if (!middle || !back) return
        if (entity.sprite.fade) {
          const timeToRemove =
            entity.time.deathTimerStartMS +
            entity.time.durationMS -
            WORLD.elapsedMS
          middle.alpha = timeToRemove / 500

          if (timeToRemove < 500) {
            // 📜 add support for higher fps, this works only for 60
            entity.position.y += 0.5
          }

          // shadow  handler, 0.08 is defaul
          back.alpha = (timeToRemove / 500) * 0.08
        }
      }
    })
  }
}
