export default class move {
  process() {
    gworld.entities.forEach((entity, id) => {
      this.move(entity)
      this.setRandomTargetPosition(entity, id)
    })
  }
  move(entity: gEntity) {
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
  }

  setRandomTargetPosition(entity: gEntity, id: number) {
    if (entity.get("alive") && id !== gconst.heroId) {
      if (!entity.get("alive").targetPosition) {
        entity.get("alive").targetPosition = _.cloneDeep(entity.get("position"))
        entity.get("alive").lastTargetPosition = gpixi.elapsedMS - 15_000
      }
      if (gpixi.elapsedMS - entity.get("alive").lastTargetPosition > 15_000) {
        if (Math.random() > 0.08 * gpixi.deltaSec) return
        let x = _.random(-500, 500)
        let y = _.random(-500, 500)
        entity.get("alive").targetPosition.x = entity.get("position").x + x
        entity.get("alive").targetPosition.y = entity.get("position").y + y
        entity.get("alive").lastTargetPosition = gpixi.elapsedMS
      }
    }
  }

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
}
