export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      //
      if (
        WORLD.loop.elapsedMS >
        entity.time.deathTimerStartMS + entity.time.durationMS
      ) {
        //
        const container = WORLD.getContainer(id)
        if (!container) return

        container.parent.removeChild(container)
        WORLD.entityContainers.delete(id)
        WORLD.entities.delete(id)
      }
    })
  }
}
