class Destination {
  //
  delayMS = 15_000

  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      if (
        id !== WORLD.heroId &&
        entity.state.active === "idle" &&
        WORLD.loop.elapsedMS > entity.move.randomDestinationMS + this.delayMS &&
        Math.random() < 0.08 * WORLD.loop.deltaSec
      ) {
        this.counter = 0
        this.setRandomDestination(entity, id)
      }
      if (GLOBAL.context === "scene") {
        entity.move.randomDestinationMS = WORLD.loop.elapsedMS
      }
    })
  }
  init() {
    EVENTS.onSingle("sceneContextChanged", () => {
      GLOBAL.sceneContextChangedMS = WORLD.loop.elapsedMS
      setTimeout(() => {
        WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
        WORLD.hero.target.id = undefined
      }, 50)
    })
  }
  private counter = 0
  private setRandomDestination(entity: Entity, id: number) {
    let possibleX = entity.position.x + _.random(-500, 500)
    let possibleY = entity.position.y + _.random(-500, 500)
    if (!COORDINATES.isWalkable(possibleX, possibleY)) {
      this.counter++
      if (this.counter < 10) this.setRandomDestination(entity, id)
      return
    }
    entity.move.finaldestination.x = possibleX
    entity.move.finaldestination.y = possibleY
    entity.move.randomDestinationMS = WORLD.loop.elapsedMS
  }
}
export const DESTINATION = new Destination()
