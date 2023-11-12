class Remove {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (
        entity.STATE &&
        entity.STATE.active === "dead" &&
        WORLD.loop.elapsedMS >
          entity.STATE.deadTimeMS + entity.STATE.deadDelayMS
      ) {
        const container = SPRITE.getContainer(id)
        if (!container) return
        container.destroy()
        SPRITE.entityContainers.delete(id)
        WORLD.entities.delete(id)
      }
    })
  }
}
export const REMOVE = new Remove()
