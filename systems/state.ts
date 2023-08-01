export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.state) return
      // LIB.logIfHero(id, entity.state.active)
      this.checkIdle(entity, id)
      if (entity.state.dead) {
        entity.state.active = "dead"
      } else if (entity.state.track) {
        entity.state.active = "track"
      } else if (entity.state.move) {
        entity.state.active = "move"
      } else if (entity.state.idle) {
        entity.state.active = "idle"
      }
      // 📜 finish state system
      this.resetStateConditions(entity)
      this.updateLastChangeMS(entity, id)
    })
  }
  private checkIdle(entity, id) {
    const lastEntity = LAST_WORLD.entities.get(id)
    if (!lastEntity) return
    if (
      entity.position.x === lastEntity.position.x &&
      entity.position.y === lastEntity.position.y
    ) {
      entity.state.idle = true
    }
  }
  private resetStateConditions(entity) {
    entity.state.idle = false
    entity.state.move = false
    entity.state.forcemove = false
    entity.state.track = false
    entity.state.cast = false
    // exclude only dead
  }
  private updateLastChangeMS(entity, id) {
    const lastEntity = LAST_WORLD.entities.get(id)
    if (!lastEntity) return
    if (entity.state.active !== lastEntity.state.active) {
      WORLD.entities.get(id).state.lastChangeMS = WORLD.loop.elapsedMS
    }
  }
}
