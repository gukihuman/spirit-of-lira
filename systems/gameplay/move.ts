export default class {
  //
  // attack stops when force move, for example from input for hero
  // and maybe there will be some cases for mobs too
  private forceMove = false

  private startAttackMS = 0
  private gamepadMoved = false

  process() {
    ENTITIES.forEach((entity, id) => {
      this.move(entity, id)
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
        SYSTEM_DATA.world.hero.move.finaldestination = undefined
        SYSTEM_DATA.world.hero.target.attacked = false
      }
      this.gamepadMoved = true
    } else {
      this.gamepadMoved = false
    }
  }

  // set hero target position to mouse position
  mouseMove() {
    if (!SYSTEM_DATA.world.hero) return
    if (SYSTEM_DATA.states.inventory) return

    const distance = LIB.distance(LIB.centerPoint(), LIB.mousePoint())

    if (distance < 10) {
      SYSTEM_DATA.world.hero.move.finaldestination = undefined
      return
    }

    SYSTEM_DATA.world.hero.state.main = "forcemove"

    const mousePosition = LIB.mousePoint()
    mousePosition.x += SYSTEM_DATA.world.hero.position.x - 960
    mousePosition.y += SYSTEM_DATA.world.hero.position.y - 540
    SYSTEM_DATA.world.hero.move.finaldestination = mousePosition
  }

  // move directly and set hero target position to undefined
  gamepadMove() {
    if (!SYSTEM_DATA.world.hero) return

    const speedPerTick = LIB.speedPerTick(SYSTEM_DATA.world.hero)

    const axesVector = LIB.vector(INPUT.gamepad.axes[0], INPUT.gamepad.axes[1])
    const angle = axesVector.angle
    let ratio = axesVector.distance
    ratio = _.clamp(ratio, 1)

    const velocity = LIB.vectorFromAngle(angle, speedPerTick)

    this.forceMove = true // gamepad always force
    this.checkCollisionAndMove(SYSTEM_DATA.world.hero, velocity, ratio)
    this.gamepadMoved = true
  }

  move(entity: Entity, id) {
    if (id === SYSTEM_DATA.world.heroId && this.gamepadMoved) return
    if (
      !entity.move ||
      !entity.move.destination ||
      !entity.move.finaldestination
    )
      return
    if (entity.state.main === "attack" || entity.state.main === "dead") return

    if (entity.state.main === "forcemove") this.forceMove = true
    else this.forceMove = false

    entity.state.main = "idle"

    const speedPerTick = LIB.speedPerTick(entity)

    const displacement = LIB.vectorFromPoints(
      entity.position,
      entity.move.destination
    )
    const finaldisplacement = LIB.vectorFromPoints(
      entity.position,
      entity.move.finaldestination
    )
    const finaldistance = finaldisplacement.distance
    const distance = displacement.distance

    if (distance < speedPerTick) {
      return
    }

    if (entity.attack && entity.target.attacked) {
      const targetEntity = ENTITIES.get(entity.target.id)
      if (
        targetEntity &&
        finaldistance < targetEntity.size.width / 2 + entity.attack.distance
      ) {
        return
      }
    }

    let ratio = _.clamp(finaldistance / 200, 1)
    ratio = Math.sqrt(ratio)
    ratio = _.clamp(ratio, 0.3, 1)

    if (SYSTEM_DATA.world.hero.target.attacked) ratio = 1

    const angle = displacement.angle
    const velocity = LIB.vectorFromAngle(angle, speedPerTick)

    this.checkCollisionAndMove(entity, velocity, ratio)
  }

  checkCollisionAndMove(entity: Entity, velocity, ratio: number) {
    const position = entity.position
    const nextX = position.x + velocity.x * ratio
    const nextY = position.y + velocity.y * ratio

    if (this.forceMove) entity.state.main = "forcemove"
    else entity.state.main = "move"

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
      entity.state.main = "idle"
      return
    }
  }
}
