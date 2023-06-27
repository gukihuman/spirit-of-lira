export default class state {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.state) return

      if (entity.state.dead) {
        entity.state.main = "dead"
        return
      }
    })
  }
}
