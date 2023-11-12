class Dead {
  process() {
    MUSEUM.processEntity("HERO", (entity, id) => {
      if (entity.ATTRIBUTES.health > 0) return
      entity.STATE.active = "dead"
      entity.TARGET.id = null
      entity.TARGET.locked = false
      SPRITE.emptyWeaponLayers()
      setTimeout(() => {
        const container = SPRITE.getContainer(id)
        if (!container) return
        container.setParent(WORLD.ground)
      }, 1000)
    })
    MUSEUM.processEntity(["ATTRIBUTES", "STATE", "NONHERO"], (entity, id) => {
      if (entity.ATTRIBUTES.health > 0) return
      entity.STATE.active = "dead"
      entity.TARGET.id = undefined
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
    })
  }
}
export const DEAD = new Dead()
