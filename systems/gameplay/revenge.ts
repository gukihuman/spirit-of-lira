export default class {
  init() {
    EVENTS.on("revenge", ({ entity, id, offender, offenderId }) => {
      if (LIB.hero(id) && !SETTINGS.gameplay.attackBack) return
      if (
        entity.state.active === "idle" ||
        (!LIB.hero(id) && entity.state.active === "move")
      ) {
        entity.target.id = offenderId
        EVENTS.emit("cast", { entity, slot: "slot1" })
      }
    })
  }
  process() {}
}
