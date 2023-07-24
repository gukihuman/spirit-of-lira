//
export default class {
  //
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.state) return

      if (entity.state.dead) {
        //
        entity.state.active = "dead"
        //
      } else if (entity.state.forcemove) {
        //
        entity.state.active = "forcemove"
      }

      this.resetStateConditions(entity)
      this.updateLastChangeMS(entity, id)
    })
  }
  private resetStateConditions(entity) {
    entity.state.idle = true
    entity.state.move = false
    entity.state.forcemove = false
    entity.state.follow = false
    entity.state.attack = false
    entity.state.dead = false
  }
  private updateLastChangeMS(entity, id) {
    //
    const lastEntity = LAST_WORLD.entities.get(id)
    if (!lastEntity) return

    if (entity.state.active !== lastEntity.state.active) {
      WORLD.entities.get(id).state.lastChangeMS = WORLD.loop.elapsedMS
    }
  }
}
