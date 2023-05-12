export default class Move {
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

      gsignal.checkCollisionAndMove(entity, velocity, ratio)
    })
  }
}
