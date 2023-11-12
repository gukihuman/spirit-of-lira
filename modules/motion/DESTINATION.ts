class Destination {
  delayMS = 15_000
  process() {
    MUSEUM.processEntity("MOVE", (entity, id) => {
      if (
        entity.NONHERO &&
        entity.STATE.active === "idle" &&
        LOOP.elapsedMS > entity.MOVE.randomDestinationMS + this.delayMS &&
        Math.random() < 0.08 * LOOP.deltaSec
      ) {
        this.counter = 0
        this.setRandomDestination(entity, id)
      }
      if (GLOBAL.context === "scene") {
        entity.MOVE.randomDestinationMS = LOOP.elapsedMS
      }
    })
  }
  init() {
    EVENTS.onSingle("sceneContextChanged", () => {
      GLOBAL.sceneContextChangedMS = LOOP.elapsedMS
      setTimeout(() => {
        SH.hero.MOVE.finaldestination = _.cloneDeep(SH.hero.POSITION)
        SH.hero.TARGET.id = undefined
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
    entity.MOVE.randomDestinationMS = LOOP.elapsedMS
  }
}
export const DESTINATION = new Destination()
