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
    let grid = SYSTEMS.collision.collisionArray
    let tileX = LIB.coordinateToTile(x)
    let tileY = LIB.coordinateToTile(y)
    if (!grid[tileY]) return
    if (grid[tileY][tileX] === 2 || grid[tileY][tileX] === 3) {
      return
    }
    entity.move.finaldestination.x = entity.position.x + x
    entity.move.finaldestination.y = entity.position.y + y
    entity.move.randomDestinationMS = GPIXI.elapsedMS
  }
}
