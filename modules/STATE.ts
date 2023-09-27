class State {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.state) return
      // controlled by dead system
      if (entity.state.active === "dead") return
      this.checkStill(entity, id)
      if (entity.state.cast) {
        entity.state.active = "cast"
      } else if (entity.state.track) {
        entity.state.active = "track"
      } else if (!entity.state.still) {
        entity.state.active = "move"
      } else {
        entity.state.active = "idle"
      }
      this.updateLastChangeMS(entity, id)
    })
  }
  private checkStill(entity, id) {
    const lastEntity = LAST.entities.get(id)
    if (!lastEntity) return
    if (
      entity.position.x === lastEntity.position.x &&
      entity.position.y === lastEntity.position.y
    ) {
      entity.state.still = true
    } else entity.state.still = false
  }
  private updateLastChangeMS(entity, id) {
    const lastEntity = LAST.entities.get(id)
    if (!lastEntity) return
    if (entity.state.active !== lastEntity.state.active) {
      WORLD.entities.get(id).state.lastChangeMS = WORLD.loop.elapsedMS
    }
  }
}
export const STATE = new State()
