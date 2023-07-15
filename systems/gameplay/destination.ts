export default class {
  //
  delayMS = 15_000

  process() {
    ENTITIES.forEach((entity, id) => {
      //
      if (
        id !== SYSTEM_DATA.world.heroId &&
        entity.move &&
        entity.state.main === "idle" &&
        GPIXI.elapsedMS > entity.move.randomDestinationMS + this.delayMS
      ) {
        this.setRandomDestination(entity, id)
      }
    })
  }

  private setRandomDestination(entity: Entity, id: number) {
    //
    if (Math.random() > 0.08 * GPIXI.deltaSec) return
    let x = _.random(-500, 500)
    let y = _.random(-500, 500)
    entity.move.destination.x = entity.position.x + x
    entity.move.destination.y = entity.position.y + y
    entity.move.randomDestinationMS = GPIXI.elapsedMS
  }
}
