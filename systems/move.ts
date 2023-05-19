export default class move {
  process() {
    gworld.entities.forEach((entity, id) => {
      this.move(entity)
      this.setRandomTargetPosition(entity, id)
    })
  }

  move(entity: gEntity) {
    if (!entity.alive || !entity.alive.targetPosition) return

    const speedPerTick = glib.speedPerTick(entity)

    const displacement = glib.vectorFromPoints(
      entity.position,
      entity.alive.targetPosition
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
    if (entity.alive && id !== gconst.heroId) {
      if (!entity.alive.targetPosition) {
        entity.alive.targetPosition = _.cloneDeep(entity.position)
        // ms add
        entity.alive.lastTargetPositionMS = gpixi.elapsedMS - 15_000
      }
      if (gpixi.elapsedMS - entity.alive.lastTargetPositionMS > 15_000) {
        if (Math.random() > 0.08 * gpixi.deltaSec) return
        let x = _.random(-500, 500)
        let y = _.random(-500, 500)
        entity.alive.targetPosition.x = entity.position.x + x
        entity.alive.targetPosition.y = entity.position.y + y
        entity.alive.lastTargetPositionMS = gpixi.elapsedMS
      }
    }
  }

  checkCollisionAndMove(entity: gEntity, velocity, ratio: number) {
    const position = entity.position
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
