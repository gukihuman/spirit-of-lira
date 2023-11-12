class Dead {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.ATTRIBUTES) return
      if (entity.ATTRIBUTES.health <= 0) {
        entity.STATE.active = "dead"
        const lastEntity = LAST.entities.get(id)
        if (
          entity.STATE.active === "dead" &&
          lastEntity.STATE.active !== "dead"
        ) {
          entity.STATE.deadTimeMS = WORLD.loop.elapsedMS
          if (!WORLD.isHero(id)) {
            PROGRESS.mobs[entity.name]++
            SAVE.update()
          }
        }
        entity.TARGET.id = undefined
        const animation = SPRITE.getLayer(id, "animation")
        const shadow = SPRITE.getLayer(id, "shadow")
        if (!animation || !shadow) return
        // fade
        const timeTillRemove =
          entity.STATE.deadTimeMS +
          entity.STATE.deadDelayMS -
          WORLD.loop.elapsedMS
        animation.alpha = timeTillRemove / 500
        if (timeTillRemove < 500) {
          entity.POSITION.y += 0.5 * (60 / WORLD.loop.fps)
        }
        // 0.08 is defaul shadow alpha
        shadow.alpha = (timeTillRemove / 500) * 0.08
      }
    })
  }
}
export const DEAD = new Dead()
