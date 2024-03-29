export default class {
  private preventGamepadMoveMS = 500 // disable axes after start track
  // used to not prevent gamepad move after kill, updates on mobs killed by hero
  lastMobKilledMS = 0
  private gamepadAxesMoved = false
  init() {
    EVENTS.onSingle("moveOrCast1", () => {
      if (WORLD.hoverId) {
        EVENTS.emitSingle("cast1")
        EVENTS.emitSingle("lockTarget")
      } else this.mouseMove()
    })
    EVENTS.onSingle("mouseMove", () => this.mouseMove())
    EVENTS.onSingle("gamepadMove", () => this.gamepadMove())
    EVENTS.onSingle("autoMouseMove", () => {
      GLOBAL.autoMouseMove = !GLOBAL.autoMouseMove
    })
  }
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      this.move(entity)
    })
    if (GLOBAL.autoMouseMove) EVENTS.emitSingle("mouseMove")
    this.checkGamepadAxes()
  }
  private checkGamepadAxes() {
    if (LIB.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone)) {
      this.gamepadAxesMoved = true
    } else {
      // first time not moved
      if (this.gamepadAxesMoved && INPUT.lastActiveDevice === "gamepad") {
        WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
      }
      this.gamepadAxesMoved = false
    }
  }
  mouseMove() {
    if (GLOBAL.context !== "world") return
    WORLD.hero.state.track = false
    WORLD.hero.state.cast = false
    WORLD.hero
    const distance = COORDINATES.distance(
      COORDINATES.conterOfScreen(),
      COORDINATES.mouseOfScreen()
    )
    if (distance < 10) {
      WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
      return
    }
    WORLD.hero.move.finaldestination = COORDINATES.mousePosition()
  }
  private gamepadMoveTries = 0
  gamepadMove() {
    const elapsedMS = WORLD.loop.elapsedMS
    if (
      WORLD.hero.state.active === "track" &&
      elapsedMS < WORLD.hero.state.lastChangeMS + this.preventGamepadMoveMS &&
      elapsedMS > this.lastMobKilledMS + this.preventGamepadMoveMS
    ) {
      return
    }
    WORLD.hero.state.track = false
    WORLD.hero.state.cast = false
    this.gamepadMoveTries = 0
    this.gamepadMoveLogic()
  }
  private gamepadMoveLogic(otherRatio = 1) {
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
      this.gamepadMoveTries++
      if (this.gamepadMoveTries > 100) return
      if (this.gamepadMoveTries > 3) {
        this.gamepadMoveLogic(otherRatio - 0.1)
      }
      this.gamepadMoveLogic(otherRatio + 0.1)
      return
    }
    hero.move.finaldestination.x = possibleDestinationX
    hero.move.finaldestination.y = possibleDestinationY
    this.gamepadAxesMoved = true
  }
  move(entity: Entity) {
    if (
      !entity.move ||
      !entity.move.destination ||
      !entity.move.finaldestination ||
      entity.state.active === "cast" ||
      entity.state.active === "dead"
    ) {
      return
    }
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
    if (WORLD.hero.state.track) ratio = 1
    const angle = displacement.angle
    const velocity = COORDINATES.vectorFromAngle(angle, speedPerTick)
    entity.position.x += velocity.x * ratio
    entity.position.y += velocity.y * ratio
  }
}
