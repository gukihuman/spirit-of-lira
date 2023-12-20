class Destination {
    delayMS = 15_000
    process() {
        MUSEUM.process_entity(["MOVE", "NONHERO"], (ent, id) => {
            if (
                ent.STATE.active === "idle" &&
                LOOP.elapsed > ent.MOVE.randomdesMS + this.delayMS &&
                Math.random() < 0.08 * LOOP.delta_sec
            ) {
                this.counter = 0
                this.setRandomdes(ent, id)
            }
            if (CONTEXT.echo.novel) {
                ent.MOVE.randomdesMS = LOOP.elapsed
            }
        })
    }
    init() {
        EVENTS.onSingle("novel context changed", () => {
            GLOBAL.sceneContextChangedMS = LOOP.elapsed
            TIME.next(() => {
                HERO.ent.MOVE.final_des = _.cloneDeep(HERO.ent.POS)
                HERO.ent.TARGET.id = undefined
            })
        })
    }
    private counter = 0
    private setRandomdes(ent, id: number) {
        let possibleX = ent.POS.x + _.random(-500, 500)
        let possibleY = ent.POS.y + _.random(-500, 500)
        if (!COLLISION.is_coord_clear({ x: possibleX, y: possibleY })) {
            this.counter++
            if (this.counter < 10) this.setRandomdes(ent, id)
            return
        }
        ent.MOVE.final_des.x = possibleX
        ent.MOVE.final_des.y = possibleY
        ent.MOVE.randomdesMS = LOOP.elapsed
    }
}
export const DESTINATION = new Destination()
