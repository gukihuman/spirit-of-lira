class Destination {
  //
  delayMS = 15_000

  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.MOVE) return
      if (
        id !== WORLD.heroId &&
        entity.STATE.active === "idle" &&
        WORLD.loop.elapsedMS > entity.MOVE.randomDestinationMS + this.delayMS &&
        Math.random() < 0.08 * WORLD.loop.deltaSec
      ) {
        this.counter = 0
        this.setRandomDestination(entity, id)
      }
      if (GLOBAL.context === "scene") {
        entity.MOVE.randomDestinationMS = WORLD.loop.elapsedMS
      }
    })
  }
  init() {
    EVENTS.onSingle("sceneContextChanged", () => {
      GLOBAL.sceneContextChangedMS = WORLD.loop.elapsedMS
      setTimeout(() => {
        WORLD.hero.MOVE.finaldestination = _.cloneDeep(WORLD.hero.POSITION)
        WORLD.hero.TARGET.id = undefined
      }, 50)
    })
  }
  private counter = 0
  private setRandomDestination(entity, id: number) {
    let possibleX = entity.POSITION.x + _.random(-500, 500)
    let possibleY = entity.POSITION.y + _.random(-500, 500)
    if (!COORD.isWalkable(possibleX, possibleY)) {
      this.counter++
      if (this.counter < 10) this.setRandomDestination(entity, id)
      return
    }
    entity.MOVE.finaldestination.x = possibleX
    entity.MOVE.finaldestination.y = possibleY
    entity.MOVE.randomDestinationMS = WORLD.loop.elapsedMS
  }
}
export const DESTINATION = new Destination()
