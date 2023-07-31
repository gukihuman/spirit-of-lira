export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (
        entity.state &&
        entity.state.active === "dead" &&
        WORLD.loop.elapsedMS >
          entity.state.lastChangeMS + entity.state.deadTimeMS
      ) {
        const container = SPRITE.getContainer(id)
        if (!container) return
        container.parent.removeChild(container)
        SPRITE.entityContainers.delete(id)
        WORLD.entities.delete(id)
      }
    })
  }
}
