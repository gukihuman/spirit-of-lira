export default class Remover {
  process() {
    WORLD.entities.forEach((entity, id) => {
      //
      if (GPIXI.elapsedMS > entity.time.creationMS + entity.time.durationMS) {
        //
        const main = GPIXI.getMain(id)
        if (!main) return

        main.parent.removeChild(main)
        GPIXI.entities.delete(id)
        WORLD.entities.delete(id)
      }
    })
  }
}
