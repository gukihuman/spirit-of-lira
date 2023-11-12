class Revenge {
  init() {
    EVENTS.on("revenge", ({ entity, id, offender, offenderId }) => {
      if (WORLD.isHero(id) && !SETTINGS.gameplay.attackBack) return
      if (
        entity.STATE.active === "idle" ||
        (!WORLD.isHero(id) && entity.STATE.active === "move")
      ) {
        entity.TARGET.id = offenderId
        EVENTS.emit("cast", { entity, slot: "slot1" })
      }
    })
  }
  process() {}
}
export const REVENGE = new Revenge()
