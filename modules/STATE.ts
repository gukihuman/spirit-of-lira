type ActiveState = "idle" | "move" | "track" | "cast" | "dead"
interface Component extends AnyObject {
    active: ActiveState
}
class State {
    component: Component = {
        active: "idle",
        still: true,
        track: false,
        cast: false,
        lastChangeMS: 0,
        deadTimeMS: Infinity,
        deadDelayMS: 1000,
    }
    process() {
        WORLD.entities.forEach((ent, id) => {
            if (!ent.STATE) return
            // controlled by dead system
            if (ent.STATE.active === "dead") return
            this.checkStill(ent, id)
            if (ent.STATE.cast) {
                ent.STATE.active = "cast"
            } else if (ent.STATE.track) {
                ent.STATE.active = "track"
            } else if (!ent.STATE.still) {
                ent.STATE.active = "move"
            } else {
                ent.STATE.active = "idle"
            }
            this.updateLastChangeMS(ent, id)
        })
    }
    private checkStill(ent, id) {
        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return
        if (ent.POS.x === lastEntity.POS.x && ent.POS.y === lastEntity.POS.y) {
            ent.STATE.still = true
        } else ent.STATE.still = false
    }
    private updateLastChangeMS(ent, id) {
        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return
        if (ent.STATE.active !== lastEntity.STATE.active) {
            WORLD.entities.get(id).STATE.lastChangeMS = LOOP.elapsed
        }
    }
}
export const STATE = new State()
