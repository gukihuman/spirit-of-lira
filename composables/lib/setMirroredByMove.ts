export function setMirroredByMove(entity) {
  if (Game().frame % 10 === 0) {
    if (entity.prevX > entity.x) {
      entity.mirrored = true
    } else if (entity.prevX < entity.x) {
      entity.mirrored = false
    }
  }
}
