export default class {
  process() {
    ENTITIES.forEach((entity, id) => {
      //
      if (
        WORLD.elapsedMS >
        entity.time.deathTimerStartMS + entity.time.durationMS
      ) {
        //
        const main = WORLD.getMain(id)
        if (!main) return

        main.parent.removeChild(main)
        WORLD.entities.delete(id)
        ENTITIES.delete(id)
      }
    })
  }
}
