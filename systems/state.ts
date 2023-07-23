//
export default class {
  //
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.state) return

      if (entity.state.dead) {
        entity.state.resolved = "dead"
        return
      }

      this.updateLastChangeMS(entity, id)
    })
  }

  private updateLastChangeMS(entity, id) {
    //
    const lastEntity = LAST_WORLD.entities.get(id)
    if (!lastEntity) return

    if (entity.state.resolved !== lastEntity.state.resolved) {
      WORLD.entities.get(id).state.lastChangeMS = WORLD.loop.elapsedMS
    }
  }
}
