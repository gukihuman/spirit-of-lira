export default class State {
  checkMove(entity, id) {
    const lastEntity = gcache.entities.get(id)
    if (!lastEntity) return
    const displacement = glib.vectorFromPoints(
      entity.get("position"),
      lastEntity.get("position")
    )
    const distance = displacement.distance

    if (distance === 0) {
      entity.get("alive").state = "idle"
      return
    }

    if (gpixi.getAnimationSprite(id, "walk")) {
      const speedPerTick = glib.speedPerTick(entity)
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

      // idle, walk, run or move
      this.checkMove(entity, id)
    })
  }
}
