export function statusManager() {
  Game().entities.forEach((entity) => {
    if (entity.x === entity.prevX && entity.y === entity.prevY) {
      entity.status = "idle"
    } else {
      entity.status = "move"
    }
    if (entity.prevX > entity.x) {
      entity.mirrored = true
    } else if (entity.prevX < entity.x) {
      entity.mirrored = false
    }
    entity.prevX = entity.x
    entity.prevY = entity.y
  })
}
