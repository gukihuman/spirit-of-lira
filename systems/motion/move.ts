export default class {
  private starttrackMS = 0
  gamepadMoved = false
  init() {
    EVENTS.onSingle("moveOrCast", () => {
      WORLD.systems.move.mouseMove()
      if (WORLD.hoverId) {
        WORLD.hero.target.id = WORLD.hoverId
        WORLD.hero.target.tracked = true
        WORLD.hero.target.locked = true
      } else {
        WORLD.hero.target.tracked = false
      }
    })
    EVENTS.onSingle("mouseMove", () => {
      WORLD.systems.move.mouseMove()
    })
    EVENTS.onSingle("autoMouseMove", () => {
      GLOBAL.autoMouseMove = !GLOBAL.autoMouseMove
    })
    EVENTS.onSingle("gamepadMove", () => {
      WORLD.systems.move.gamepadMove()
    })
  }
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      this.move(entity)
    })
    if (GLOBAL.autoMouseMove) EVENTS.emitSingle("mouseMove")
    this.updateGamepadMoveInfo()
  }
  // set hero target position to mouse position
  mouseMove() {
    if (!WORLD.hero) return
    if (INTERFACE.inventory) return
    const distance = COORDINATES.distance(
      COORDINATES.conterOfScreen(),
      COORDINATES.mouseOfScreen()
    )
    if (distance < 10) {
      WORLD.hero.move.finaldestination = undefined
      return
    }
    WORLD.hero.state.forcemove = true
    const mousePosition = COORDINATES.mouseOfScreen()
    mousePosition.x += WORLD.hero.position.x - 960
    mousePosition.y += WORLD.hero.position.y - 540
    WORLD.hero.move.finaldestination = mousePosition
  }
  private updateGamepadMoveInfo() {
    if (LIB.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone)) {
      if (WORLD.loop.elapsedMS > this.starttrackMS + 1000) {
        WORLD.hero.target.tracked = false
      }
      this.gamepadMoved = true
    } else {
      // first time not moved
      if (this.gamepadMoved && INPUT.lastActiveDevice === "gamepad") {
        const hero = WORLD.hero
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
    if (!WORLD.hero) return
    const speedPerTick = COORDINATES.speedPerTick(WORLD.hero)
    const axesVector = COORDINATES.vector(
      INPUT.gamepad.axes[0],
      INPUT.gamepad.axes[1]
    )
    const angle = axesVector.angle
    let ratio = axesVector.distance
    ratio = _.clamp(ratio, 1)
    const vectorToFinalDestination = COORDINATES.vectorFromAngle(
      angle,
      speedPerTick * WORLD.loop.fps * 2
    )
    const hero = WORLD.hero
    const possibleDestinationX =
      hero.position.x + vectorToFinalDestination.x * ratio * otherRatio
    const possibleDestinationY =
      hero.position.y + vectorToFinalDestination.y * ratio * otherRatio
    if (
      !COORDINATES.isWalkable(possibleDestinationX, possibleDestinationY) &&
      GLOBAL.collision
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
    WORLD.hero.state.active = "forcemove"
    this.gamepadMoved = true
  }
  move(entity: Entity) {
    if (
      !entity.move ||
      !entity.move.destination ||
      !entity.move.finaldestination
    )
      return
    if (entity.state.active === "attack" || entity.state.active === "dead")
      return
    entity.state.active = "idle"
    const speedPerTick = COORDINATES.speedPerTick(entity)
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
    if (entity.attack && entity.target.tracked) {
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
    if (WORLD.hero.target.tracked) ratio = 1
    const angle = displacement.angle
    const velocity = COORDINATES.vectorFromAngle(angle, speedPerTick)
    entity.position.x += velocity.x * ratio
    entity.position.y += velocity.y * ratio
  }
}
