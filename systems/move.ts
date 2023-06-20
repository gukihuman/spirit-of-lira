export default class move {
  //
  // attack stops when force move, for example from input for hero
  // and maybe there will be some cases for mobs too
  private forceMove = false

  private startAttackMS = 0
  private gamepadMoved = false

  process() {
    WORLD.entities.forEach((entity, id) => {
      this.move(entity, id)
      this.setRandomTargetPosition(entity, id)
    })

    if (SYSTEM_DATA.states.autoMouseMove) SIGNAL.emit("mouseMove")
    this.updateGamepadMoveInfo()
  }
  private updateGamepadMoveInfo() {
    if (LIB.deadZoneExceed(USER_DATA.settings.inputOther.gamepad.deadZone)) {
      if (this.gamepadMoved === false) {
        this.startAttackMS = GPIXI.elapsedMS
      }

      if (GPIXI.elapsedMS > this.startAttackMS + 1000) {
        GLOBAL.hero.move.destination = undefined
        GLOBAL.hero.move.targetAttacked = false
      }
      this.gamepadMoved = true
    } else {
      this.gamepadMoved = false
    }
  }

  // set hero target position to mouse position
  mouseMove() {
    if (!GLOBAL.hero) return
    if (SYSTEM_DATA.states.inventory) return

    const distance = LIB.distance(LIB.centerPoint(), LIB.mousePoint())

    if (distance < 10) {
      GLOBAL.hero.move.destination = undefined
      return
    }

    GLOBAL.hero.move.state = "forcemove"

    const mousePosition = LIB.mousePoint()
    mousePosition.x += GLOBAL.hero.position.x - 960
    mousePosition.y += GLOBAL.hero.position.y - 540
    GLOBAL.hero.move.destination = mousePosition
  }

  // move directly and set hero target position to undefined
  gamepadMove() {
    if (!GLOBAL.hero) return

    const speedPerTick = LIB.speedPerTick(GLOBAL.hero)

    const axesVector = LIB.vector(INPUT.gamepad.axes[0], INPUT.gamepad.axes[1])
    const angle = axesVector.angle
    let ratio = axesVector.distance
    ratio = _.clamp(ratio, 1)

    const velocity = LIB.vectorFromAngle(angle, speedPerTick)

    this.forceMove = true // gamepad always force
    this.checkCollisionAndMove(GLOBAL.hero, velocity, ratio)
    this.gamepadMoved = true
  }

  move(entity: gEntity, id) {
    if (id === GLOBAL.heroId && this.gamepadMoved) return
    if (!entity.move || !entity.move.destination) return
    if (entity.move.state === "attack") return

    if (entity.move.state === "forcemove") this.forceMove = true
    else this.forceMove = false

    entity.move.state = "idle"

    const speedPerTick = LIB.speedPerTick(entity)

    const displacement = LIB.vectorFromPoints(
      entity.position,
      entity.move.destination
    )
    const distance = displacement.distance

    if (distance < speedPerTick) {
      return
    }

    if (entity.attack && entity.move.targetAttacked) {
      const targetEntity = WORLD.entities.get(entity.move.targetEntityId)
      if (
        targetEntity &&
        distance < targetEntity.size.width / 2 + entity.attack.distance
      ) {
        return
      }
    }

    let ratio = _.clamp(distance / 200, 1)
    ratio = Math.sqrt(ratio)
    ratio = _.clamp(ratio, 0.3, 1)

    if (GLOBAL.hero.move.targetAttacked) ratio = 1

    const angle = displacement.angle
    const velocity = LIB.vectorFromAngle(angle, speedPerTick)

    this.checkCollisionAndMove(entity, velocity, ratio)
  }

  setRandomTargetPosition(entity: gEntity, id: number) {
    if (entity.move && id !== GLOBAL.heroId && entity.move.state === "idle") {
      if (!entity.move.destination) {
        entity.move.destination = _.cloneDeep(entity.position)
        entity.move.lastAutoTargetPositionMS = GPIXI.elapsedMS - 15_000
      }
      if (GPIXI.elapsedMS - entity.move.lastAutoTargetPositionMS > 15_000) {
        if (Math.random() > 0.08 * GPIXI.deltaSec) return
        let x = _.random(-500, 500)
        let y = _.random(-500, 500)
        entity.move.destination.x = entity.position.x + x
        entity.move.destination.y = entity.position.y + y
        entity.move.lastAutoTargetPositionMS = GPIXI.elapsedMS
      }
    }
  }

  checkCollisionAndMove(entity: gEntity, velocity, ratio: number) {
    const position = entity.position
    const nextX = position.x + velocity.x * ratio
    const nextY = position.y + velocity.y * ratio

    if (this.forceMove) entity.move.state = "forcemove"
    else entity.move.state = "move"

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
      entity.move.state = "idle"
      return
    }
  }
}
