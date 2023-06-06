export default class move {
  process() {
    WORLD.entities.forEach((entity, id) => {
      this.move(entity)
      this.setRandomTargetPosition(entity, id)
    })

    if (GLOBAL.context === "autoMove") SIGNAL.emit("mouseMove")
  }

  // set hero target position to mouse position
  mouseMove() {
    if (!GLOBAL.hero) return
    if (SYSTEM_DATA.states.inventory) return

    const distance = LIB.distance(LIB.centerPoint(), LIB.mousePoint())

    if (distance < 10) {
      GLOBAL.hero.alive.targetPosition = undefined
      return
    }

    const mousePosition = LIB.mousePoint()
    mousePosition.x += GLOBAL.hero.position.x - 960
    mousePosition.y += GLOBAL.hero.position.y - 540
    GLOBAL.hero.alive.targetPosition = mousePosition
  }

  // move directly and set hero target position to undefined
  gamepadMove() {
    if (!GLOBAL.hero) return

    GLOBAL.hero.alive.targetPosition = undefined
    const speedPerTick = LIB.speedPerTick(GLOBAL.hero)

    const axesVector = LIB.vector(INPUT.gamepad.axes[0], INPUT.gamepad.axes[1])
    const angle = axesVector.angle
    let ratio = axesVector.distance
    ratio = _.clamp(ratio, 1)

    const velocity = LIB.vectorFromAngle(angle, speedPerTick)

    this.checkCollisionAndMove(GLOBAL.hero, velocity, ratio)
  }

  move(entity: gEntity) {
    if (!entity.alive || !entity.alive.targetPosition) return

    const speedPerTick = LIB.speedPerTick(entity)

    const displacement = LIB.vectorFromPoints(
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

    if (GLOBAL.hero.alive.targetAttacked) ratio = 1

    const angle = displacement.angle
    const velocity = LIB.vectorFromAngle(angle, speedPerTick)

    this.checkCollisionAndMove(entity, velocity, ratio)
  }

  setRandomTargetPosition(entity: gEntity, id: number) {
    if (entity.alive && id !== GLOBAL.heroId) {
      if (!entity.alive.targetPosition) {
        entity.alive.targetPosition = _.cloneDeep(entity.position)
        entity.alive.lastTargetPositionMS = PIXI_GUKI.elapsedMS - 15_000
      }
      if (PIXI_GUKI.elapsedMS - entity.alive.lastTargetPositionMS > 15_000) {
        if (Math.random() > 0.08 * PIXI_GUKI.deltaSec) return
        let x = _.random(-500, 500)
        let y = _.random(-500, 500)
        entity.alive.targetPosition.x = entity.position.x + x
        entity.alive.targetPosition.y = entity.position.y + y
        entity.alive.lastTargetPositionMS = PIXI_GUKI.elapsedMS
      }
    }
  }

  checkCollisionAndMove(entity: gEntity, velocity, ratio: number) {
    const position = entity.position
    const nextX = position.x + velocity.x * ratio
    const nextY = position.y + velocity.y * ratio
    if (!SYSTEM_DATA.states.collision) {
      position.x = nextX
      position.y = nextY
      return
    }

    if (LIB.isWalkable(nextX, nextY)) {
      position.x = nextX
      position.y = nextY
    } else {
      if (LIB.isWalkable(nextX, position.y)) {
        position.x = nextX
        return
      }
      if (LIB.isWalkable(position.x, nextY)) {
        position.y = nextY
        return
      }
      return
    }
  }
}
