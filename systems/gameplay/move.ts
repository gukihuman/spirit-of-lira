export default class {
  //
  // attack stops when force move, for example from input for hero
  // and maybe there will be some cases for mobs too
  private forceMove = false

  private startMoveToAttackMS = 0
  gamepadMoved = false

  process() {
    WORLD.entities.forEach((entity) => {
      this.move(entity)
    })

    if (STATES.autoMouseMove) EVENTS.emit("mouseMove")
    this.updateGamepadMoveInfo()
  }
  // set hero target position to mouse position
  mouseMove() {
    if (!STATES.hero) return
    if (STATES.inventory) return

    const distance = COORDINATES.distance(
      COORDINATES.conterOfScreen(),
      COORDINATES.mouseOfScreen()
    )

    if (distance < 10) {
      STATES.hero.move.finaldestination = undefined
      return
    }

    STATES.hero.state.main = "forcemove"

    const mousePosition = COORDINATES.mouseOfScreen()
    mousePosition.x += STATES.hero.position.x - 960
    mousePosition.y += STATES.hero.position.y - 540
    STATES.hero.move.finaldestination = mousePosition
  }

  private updateGamepadMoveInfo() {
    if (LIB.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone)) {
      //
      if (WORLD.loop.elapsedMS > this.startMoveToAttackMS + 1000) {
        STATES.hero.target.attacked = false
      }
      this.gamepadMoved = true
      //
    } else {
      // first time not moved
      if (this.gamepadMoved && INPUT.lastActiveDevice === "gamepad") {
        const hero = STATES.hero
        hero.move.finaldestination.x = hero.position.x
        hero.move.finaldestination.y = hero.position.y
      }
      this.gamepadMoved = false
    }
  }

  private tries = 0

  gamepadMove() {
    this.tries = 0
    this.internalGamepadMove()
  }

  private internalGamepadMove(otherRatio = 1) {
    if (!STATES.hero) return

    const speedPerTick = LIB.speedPerTick(STATES.hero)

    const axesVector = COORDINATES.vector(
      INPUT.gamepad.axes[0],
      INPUT.gamepad.axes[1]
    )
    const angle = axesVector.angle
    let ratio = axesVector.distance
    ratio = _.clamp(ratio, 1)

    const vectorToFinalDestination = COORDINATES.vectorFromAngle(
      angle,
      speedPerTick * WORLD.loop.averageFPS * 2
    )

    const hero = STATES.hero
    const possibleDestinationX =
      hero.position.x + vectorToFinalDestination.x * ratio * otherRatio
    const possibleDestinationY =
      hero.position.y + vectorToFinalDestination.y * ratio * otherRatio

    if (
      !COORDINATES.isWalkable(possibleDestinationX, possibleDestinationY) &&
      STATES.collision
    ) {
      this.tries++
      if (this.tries > 100) return
      if (this.tries > 3) {
        this.internalGamepadMove(otherRatio - 0.1)
      }
      this.internalGamepadMove(otherRatio + 0.1)
      return
    }

    hero.move.finaldestination.x = possibleDestinationX
    hero.move.finaldestination.y = possibleDestinationY

    STATES.hero.state.main = "forcemove"
    this.forceMove = true
    this.gamepadMoved = true
  }

  move(entity: Entity) {
    // if (id === STATES.heroId && this.gamepadMoved) return
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

    const displacement = COORDINATES.vectorFromPoints(
      entity.position,
      entity.move.destination
    )
    const finaldisplacement = COORDINATES.vectorFromPoints(
      entity.position,
      entity.move.finaldestination
    )
    const finaldistance = finaldisplacement.distance
    const distance = displacement.distance

    if (distance < speedPerTick) {
      return
    }

    if (entity.attack && entity.target.attacked) {
      const targetEntity = WORLD.entities.get(entity.target.id)
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

    if (STATES.hero.target.attacked) ratio = 1

    const angle = displacement.angle
    const velocity = COORDINATES.vectorFromAngle(angle, speedPerTick)

    this.checkCollisionAndMove(entity, velocity, ratio)
  }

  checkCollisionAndMove(entity: Entity, velocity, ratio: number) {
    const position = entity.position
    const nextX = position.x + velocity.x * ratio
    const nextY = position.y + velocity.y * ratio

    if (this.forceMove && this.gamepadMoved) entity.state.main = "forcemove"
    else entity.state.main = "move"

    if (!STATES.collision) {
      position.x = nextX
      position.y = nextY
      return
    }

    if (COORDINATES.isWalkable(nextX, nextY)) {
      position.x = nextX
      position.y = nextY
    } else {
      if (COORDINATES.isWalkable(nextX, position.y)) {
        position.x = nextX
        return
      }
      if (COORDINATES.isWalkable(position.x, nextY)) {
        position.y = nextY
        return
      }
      entity.state.main = "idle"
      return
    }
  }
}