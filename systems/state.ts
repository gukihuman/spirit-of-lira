export default class {
  process() {
    ENTITIES.forEach((entity, id) => {
      if (!entity.state) return

      if (entity.state.dead) {
        entity.state.main = "dead"
        return
      }
    })
  }
}
