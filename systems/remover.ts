export default class {
  process() {
    ENTITIES.forEach((entity, id) => {
      //
      if (
        GPIXI.elapsedMS >
        entity.time.deathTimerStartMS + entity.time.durationMS
      ) {
        //
        const main = GPIXI.getMain(id)
        if (!main) return

        main.parent.removeChild(main)
        GPIXI.entities.delete(id)
        ENTITIES.delete(id)
      }
    })
  }
}
