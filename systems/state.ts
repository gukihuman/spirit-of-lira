export default class State {
  checkMove(entity, id) {
    const lastEntity = gcache.entities.get(id)
    if (!lastEntity) return
    const displacement = glib.vectorFromPoints(
      entity.get("position"),
      lastEntity.get("position")
    )
    const distance = displacement.distance
    const speedPerTick = glib.speedPerTick(entity)

    if (distance / speedPerTick < 0.1) {
      entity.get("alive").state = "idle"
      return
    }

    if (gpixi.getAnimationSprite(id, "walk")) {
      if (distance / speedPerTick < 0.8) {
        entity.get("alive").state = "walk"
      } else {
        entity.get("alive").state = "run"
      }
    } else {
      entity.get("alive").state = "move"
    }
  }

  process() {
    gworld.entities.forEach((entity, id) => {
      if (!entity.get("alive")) return
      if (gpixi.elapsedMS - entity.get("alive").lastStateSwitchMS < 100) return

      // idle, walk, run or move
      this.checkMove(entity, id)

      const lastEntity = gcache.entities.get(id)
      if (entity.get("alive").state !== lastEntity.get("alive").state) {
        entity.get("alive").lastStateSwitchMS = gpixi.elapsedMS
      }
    })
  }
}
