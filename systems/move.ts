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
        GLOBAL.hero.target.attacked = false
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

    GLOBAL.hero.state.main = "forcemove"

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

  move(entity: Entity, id) {
    if (id === GLOBAL.heroId && this.gamepadMoved) return
    if (!entity.move || !entity.move.destination) return
    if (entity.state.main === "attack") return

    if (entity.state.main === "forcemove") this.forceMove = true
    else this.forceMove = false

    entity.state.main = "idle"

    const speedPerTick = LIB.speedPerTick(entity)

    const displacement = LIB.vectorFromPoints(
      entity.position,
      entity.move.destination
    )
    const distance = displacement.distance

    if (distance < speedPerTick) {
      return
    }

    if (entity.attack && entity.target.attacked) {
      const targetEntity = WORLD.entities.get(entity.target.id)
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

    if (GLOBAL.hero.target.attacked) ratio = 1

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
