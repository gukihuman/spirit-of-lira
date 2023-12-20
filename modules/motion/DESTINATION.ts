class Destination {
    delayMS = 15_000
    process() {
        MUSEUM.process_entity(["MOVE", "NONHERO"], (entity, id) => {
            if (
                entity.STATE.active === "idle" &&
                LOOP.elapsed > entity.MOVE.randomdesMS + this.delayMS &&
                Math.random() < 0.08 * LOOP.delta_sec
            ) {
                this.counter = 0
                this.setRandomdes(entity, id)
            }
            if (CONTEXT.echo.novel) {
                entity.MOVE.randomdesMS = LOOP.elapsed
            }
        })
    }
    init() {
        EVENTS.onSingle("novel context changed", () => {
            GLOBAL.sceneContextChangedMS = LOOP.elapsed
            TIME.next(() => {
                HERO.entity.MOVE.final_des = _.cloneDeep(HERO.entity.POS)
                HERO.entity.TARGET.id = undefined
            })
        })
    }
    private counter = 0
    private setRandomdes(entity, id: number) {
        let possibleX = entity.POS.x + _.random(-500, 500)
        let possibleY = entity.POS.y + _.random(-500, 500)
        if (!COLLISION.is_coord_clear({ x: possibleX, y: possibleY })) {
            this.counter++
            if (this.counter < 10) this.setRandomdes(entity, id)
            return
        }
        entity.MOVE.final_des.x = possibleX
        entity.MOVE.final_des.y = possibleY
        entity.MOVE.randomdesMS = LOOP.elapsed
    }
}
export const DESTINATION = new Destination()
