class Revenge {
  init() {
    EVENTS.on("revenge", ({ entity, id, offender, offenderId }) => {
      if (WORLD.isHero(id) && !SETTINGS.gameplay.attackBack) return
      if (
        entity.state.active === "idle" ||
        (!WORLD.isHero(id) && entity.state.active === "move")
      ) {
        entity.target.id = offenderId
        EVENTS.emit("cast", { entity, slot: "slot1" })
      }
    })
  }
  process() {}
}
export const REVENGE = new Revenge()
