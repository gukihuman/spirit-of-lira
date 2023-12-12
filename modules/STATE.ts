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
        WORLD.entities.forEach((entity, id) => {
            if (!entity.STATE) return
            // controlled by dead system
            if (entity.STATE.active === "dead") return
            this.checkStill(entity, id)
            if (entity.STATE.cast) {
                entity.STATE.active = "cast"
            } else if (entity.STATE.track) {
                entity.STATE.active = "track"
            } else if (!entity.STATE.still) {
                entity.STATE.active = "move"
            } else {
                entity.STATE.active = "idle"
            }
            this.updateLastChangeMS(entity, id)
        })
    }
    private checkStill(entity, id) {
        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return
        if (
            entity.POSITION.x === lastEntity.POSITION.x &&
            entity.POSITION.y === lastEntity.POSITION.y
        ) {
            entity.STATE.still = true
        } else entity.STATE.still = false
    }
    private updateLastChangeMS(entity, id) {
        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return
        if (entity.STATE.active !== lastEntity.STATE.active) {
            WORLD.entities.get(id).STATE.lastChangeMS = LOOP.elapsed
        }
    }
}
export const STATE = new State()
