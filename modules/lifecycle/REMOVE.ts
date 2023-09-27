class Remove {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (
        entity.state &&
        entity.state.active === "dead" &&
        WORLD.loop.elapsedMS >
          entity.state.deadTimeMS + entity.state.deadDelayMS
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
