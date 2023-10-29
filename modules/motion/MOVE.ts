class Move {
  private preventGamepadMoveMS = 500 // disable axes after start track
  // used to not prevent gamepad move after kill, updates when hero kill mobs
  lastMobKilledMS = 0
  private gamepadAxesMoved = false
  init() {
    EVENTS.onSingle("decide", () => {
      if (GLOBAL.hoverId) {
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
    if (GLOBAL.context === "scene") return
    WORLD.entities.forEach((entity) => {
      if (!entity.move) return
      this.move(entity)
    })
    if (GLOBAL.autoMouseMove) EVENTS.emitSingle("mouseMove")
    this.checkGamepadAxes()
  }
  private checkGamepadAxes() {
    if (LIB.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone, INPUT)) {
      this.gamepadAxesMoved = true
    } else {
      // first time not moved
      if (this.gamepadAxesMoved && GLOBAL.lastActiveDevice === "gamepad") {
        WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
      }
      this.gamepadAxesMoved = false
    }
  }
  // TODO anything
  mouseMove() {
    WORLD.hero.state.track = false
    WORLD.hero.state.cast = false
    WORLD.hero
    const distance = COORD.distance(
      COORD.conterOfScreen(),
      COORD.mouseOfScreen()
    )
    if (distance < 10) {
      WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
      return
    }
    const x = COORD.mousePosition().x
    const y = COORD.mousePosition().y
    if (COORD.isWalkable(x, y)) {
      WORLD.hero.move.finaldestination = COORD.mousePosition()
    }
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
    const speedPerTick = COORD.speedPerTick(WORLD.hero)
    const axesVector = COORD.vector(
      INPUT.gamepad.axes[0],
      INPUT.gamepad.axes[1]
    )
    const angle = axesVector.angle
    let ratio = axesVector.distance
    ratio = _.clamp(ratio, 1)
    const vectorToFinalDestination = COORD.vectorFromAngle(
      angle,
      speedPerTick * WORLD.loop.fps * 2
    )
    const hero = WORLD.hero
    const possibleDestinationX =
      hero.position.x + vectorToFinalDestination.x * ratio * otherRatio
    const possibleDestinationY =
      hero.position.y + vectorToFinalDestination.y * ratio * otherRatio
    if (
      !COORD.isWalkable(possibleDestinationX, possibleDestinationY) &&
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
  private canMove(entity) {
    if (
      !entity.move ||
      !entity.state ||
      !entity.move.destination ||
      !entity.move.finaldestination
    ) {
      return false
    }
    if (entity.state.active === "cast" || entity.state.active === "dead") {
      return false
    }
    return true
  }
  move(entity: Entity) {
    if (!this.canMove(entity)) return
    const speedPerTick = COORD.speedPerTick(entity)
    const displacement = COORD.vectorFromPoints(
      entity.position,
      entity.move.destination
    )
    const finaldisplacement = COORD.vectorFromPoints(
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
    const velocity = COORD.vectorFromAngle(angle, speedPerTick)
    entity.position.x += velocity.x * ratio
    entity.position.y += velocity.y * ratio
  }
}
export const MOVE = new Move()
