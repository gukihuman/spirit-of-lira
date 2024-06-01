class Revenge {
    init() {
        EVENTS.on("revenge", ({ ent, id, offender, offenderId }) => {
            if (ent.HERO && !SETTINGS.echo.general.attackBack) return
            if (
                ent.STATE.active === "idle" ||
                (!ent.HERO && ent.STATE.active === "move")
            ) {
                ent.TARGET.id = offenderId
                EVENTS.emit("cast", { ent, slot: "slot1" })
            }
        })
    }
    process() {}
}
export const REVENGE = new Revenge()
