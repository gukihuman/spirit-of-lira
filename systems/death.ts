export default class {
  process() {
    ENTITIES.forEach((entity, id) => {
      if (!entity.attributes) return
      if (entity.attributes.health <= 0) {
        if (!entity.state.dead) {
          entity.time.durationMS = 1300
          entity.time.deathTimerStartMS = GPIXI.elapsedMS
        }

        entity.state.dead = true
        entity.target.id = undefined
        entity.target.entity = undefined
        entity.target.attacked = undefined
        entity.target.locked = undefined

        const middle = GPIXI.getMiddle(id)
        const back = GPIXI.getBack(id)
        if (!middle || !back) return
        if (entity.visual.fade) {
          const timeToRemove =
            entity.time.deathTimerStartMS +
            entity.time.durationMS -
            GPIXI.elapsedMS
          middle.alpha = timeToRemove / 500

          if (timeToRemove < 500) {
            // 📜 dont support higher fps
            entity.position.y += 0.5
          }

          // shadow  handler, 0.08 is defaul
          back.alpha = (timeToRemove / 500) * 0.08
        }
      }
    })
  }
}
