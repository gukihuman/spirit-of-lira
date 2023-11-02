class Dead {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.attributes) return
      if (entity.attributes.health <= 0) {
        entity.state.active = "dead"
        const lastEntity = LAST.entities.get(id)
        if (
          entity.state.active === "dead" &&
          lastEntity.state.active !== "dead"
        ) {
          entity.state.deadTimeMS = WORLD.loop.elapsedMS
          if (!WORLD.isHero(id)) {
            PROGRESS.mobs[entity.name]++
            SAVE.update()
          }
        }
        entity.target.id = undefined
        const animation = SPRITE.getLayer(id, "animation")
        const shadow = SPRITE.getLayer(id, "shadow")
        if (!animation || !shadow) return
        // fade
        const timeTillRemove =
          entity.state.deadTimeMS +
          entity.state.deadDelayMS -
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
export const DEAD = new Dead()
