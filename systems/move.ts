export default class move {
  checkCollisionAndMove(entity: gEntity, velocity, ratio: number) {
    const position = entity.get("position")
    const nextX = position.x + velocity.x * ratio
    const nextY = position.y + velocity.y * ratio
    if (!gsd.states.collision) {
      position.x = nextX
      position.y = nextY
      return
    }

    if (glib.isWalkable(nextX, nextY)) {
      position.x = nextX
      position.y = nextY
    } else {
      if (glib.isWalkable(nextX, position.y)) {
        position.x = nextX
        return
      }
      if (glib.isWalkable(position.x, nextY)) {
        position.y = nextY
        return
      }
      return
    }
  }
  process() {
    gworld.entities.forEach((entity) => {
      if (!entity.get("alive") || !entity.get("alive").targetPosition) return

      const speedPerTick = glib.speedPerTick(entity)

      const displacement = glib.vectorFromPoints(
        entity.get("position"),
        entity.get("alive").targetPosition
      )
      const distance = displacement.distance
      if (distance < speedPerTick) return

      let ratio = _.clamp(distance / 200, 1)
      ratio = Math.sqrt(ratio)
      ratio = _.clamp(ratio, 0.3, 1)

      const angle = displacement.angle
      const velocity = glib.vectorFromAngle(angle, speedPerTick)

      this.checkCollisionAndMove(entity, velocity, ratio)
    })
  }
}
