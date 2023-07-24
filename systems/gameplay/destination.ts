export default class {
  //
  delayMS = 15_000

  process() {
    WORLD.entities.forEach((entity, id) => {
      //
      if (
        id !== WORLD.heroId &&
        entity.move &&
        entity.state.active === "idle" &&
        WORLD.loop.elapsedMS > entity.move.randomDestinationMS + this.delayMS &&
        Math.random() < 0.08 * WORLD.loop.deltaSec
      ) {
        this.counter = 0
        this.setRandomDestination(entity, id)
      }
    })
  }

  private counter = 0
  private setRandomDestination(entity: Entity, id: number) {
    //
    let x = _.random(-500, 500)
    let y = _.random(-500, 500)
    let grid = WORLD.systems.collision.collisionArray
    let tileX = COORDINATES.coordinateToTile(x)
    let tileY = COORDINATES.coordinateToTile(y)
    if (!grid[tileY]) return
    if (grid[tileY][tileX] === 2 || grid[tileY][tileX] === 3) {
      this.counter++
      if (this.counter < 10) this.setRandomDestination(entity, id)
      return
    }
    entity.move.finaldestination.x = entity.position.x + x
    entity.move.finaldestination.y = entity.position.y + y
    entity.move.randomDestinationMS = WORLD.loop.elapsedMS
  }
}
