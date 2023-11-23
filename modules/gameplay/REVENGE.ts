class Revenge {
  init() {
    EVENTS.on("revenge", ({ entity, id, offender, offenderId }) => {
      if (entity.HERO && !SETTINGS.general.attackBack) return
      if (
        entity.STATE.active === "idle" ||
        (!entity.HERO && entity.STATE.active === "move")
      ) {
        entity.TARGET.id = offenderId
        EVENTS.emit("cast", { entity, slot: "slot1" })
      }
    })
  }
  process() {}
}
export const REVENGE = new Revenge()
