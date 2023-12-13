class Destination {
    delayMS = 15_000
    process() {
        MUSEUM.process_entity("MOVE", (entity, id) => {
            if (
                entity.NONHERO &&
                entity.STATE.active === "idle" &&
                LOOP.elapsed > entity.MOVE.randomDestinationMS + this.delayMS &&
                Math.random() < 0.08 * LOOP.delta_sec
            ) {
                this.counter = 0
                this.setRandomDestination(entity, id)
            }
            if (GAME_STATE.echo.novel) {
                entity.MOVE.randomDestinationMS = LOOP.elapsed
            }
        })
    }
    init() {
        EVENTS.onSingle("root game state changed", () => {
            GLOBAL.sceneContextChangedMS = LOOP.elapsed
            TIME.run_next_iteration(() => {
                HERO.entity.MOVE.final_destination = _.cloneDeep(
                    HERO.entity.POSITION
                )
                HERO.entity.TARGET.id = undefined
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
        entity.MOVE.final_destination.x = possibleX
        entity.MOVE.final_destination.y = possibleY
        entity.MOVE.randomDestinationMS = LOOP.elapsed
    }
}
export const DESTINATION = new Destination()
