export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      //
      if (
        WORLD.loop.elapsedMS >
        entity.time.deathTimerStartMS + entity.time.durationMS
      ) {
        //
        const main = WORLD.getMain(id)
        if (!main) return

        main.parent.removeChild(main)
        WORLD.entityContainers.delete(id)
        WORLD.entities.delete(id)
      }
    })
  }
}
