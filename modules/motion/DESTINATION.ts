class Destination {
    delayMS = 15_000
    process() {
        MUSEUM.processEntity("MOVE", (entity, id) => {
            if (
                entity.NONHERO &&
                entity.STATE.active === "idle" &&
                LOOP.elapsed > entity.MOVE.randomDestinationMS + this.delayMS &&
                Math.random() < 0.08 * LOOP.delta_sec
            ) {
                this.counter = 0
                this.setRandomDestination(entity, id)
            }
            if (GAME_STATE.echo.scene) {
                entity.MOVE.randomDestinationMS = LOOP.elapsed
            }
        })
    }
    init() {
        EVENTS.onSingle("sceneContextChanged", () => {
            GLOBAL.sceneContextChangedMS = LOOP.elapsed
            TIME.run_after_iterations(() => {
                SH.hero.MOVE.finaldestination = _.cloneDeep(SH.hero.POSITION)
                SH.hero.TARGET.id = undefined
            })
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
        entity.MOVE.randomDestinationMS = LOOP.elapsed
    }
}
export const DESTINATION = new Destination()
