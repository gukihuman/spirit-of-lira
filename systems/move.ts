export default class move {
  process() {
    gworld.entities.forEach((entity, id) => {
      this.move(entity)
      this.setRandomTargetPosition(entity, id)
    })

    if (gg.context === "autoMove") gsignal.emit("mouseMove")
  }

  // set hero target position to mouse position
  mouseMove() {
    if (!gg.hero) return
    if (gsd.states.inventory) return

    const distance = glib.distance(glib.centerPoint(), glib.mousePoint())

    if (distance < 10) {
      gg.hero.alive.targetPosition = undefined
      return
    }

    const mousePosition = glib.mousePoint()
    mousePosition.x += gg.hero.position.x - 960
    mousePosition.y += gg.hero.position.y - 540
    gg.hero.alive.targetPosition = mousePosition
  }

  // move directly and set hero target position to undefined
  gamepadMove() {
    if (!gg.hero) return

    gg.hero.alive.targetPosition = undefined
    const speedPerTick = glib.speedPerTick(gg.hero)

    const axesVector = glib.vector(gic.gamepad.axes[0], gic.gamepad.axes[1])
    const angle = axesVector.angle
    let ratio = axesVector.distance
    ratio = _.clamp(ratio, 1)

    const velocity = glib.vectorFromAngle(angle, speedPerTick)

    this.checkCollisionAndMove(gg.hero, velocity, ratio)
  }

  move(entity: gEntity) {
    if (!entity.alive || !entity.alive.targetPosition) return

    const speedPerTick = glib.speedPerTick(entity)

    const displacement = glib.vectorFromPoints(
      entity.position,
      entity.alive.targetPosition
    )
    const distance = displacement.distance

    if (distance < speedPerTick) {
      // entity.alive.targetPosition = undefined
      return
    }

    let ratio = _.clamp(distance / 200, 1)
    ratio = Math.sqrt(ratio)
    ratio = _.clamp(ratio, 0.3, 1)

    if (gg.hero.alive.targetAttacked) ratio = 1

    const angle = displacement.angle
    const velocity = glib.vectorFromAngle(angle, speedPerTick)

    this.checkCollisionAndMove(entity, velocity, ratio)
  }

  setRandomTargetPosition(entity: gEntity, id: number) {
    if (entity.alive && id !== gg.heroId) {
      if (!entity.alive.targetPosition) {
        entity.alive.targetPosition = _.cloneDeep(entity.position)
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
