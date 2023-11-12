class Move {
  component = {
    speed: 5,

    destination: null,
    finaldestination: null,
    path: [],

    randomDestinationMS: 0,
    setMousePointOnWalkableMS: 0,

    // 🔧
    depend: ["POSITION"],
    trigger: ["TARGET", "ATTRIBUTES", "SHADOW", "STATE"],
    inject(entity, id) {
      entity.MOVE.finaldestination = _.cloneDeep(entity.POSITION)
      entity.MOVE.randomDestinationMS = LOOP.elapsedMS - 10_000
    },
  }

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
      if (!entity.MOVE) return
      this.move(entity)
    })
    if (GLOBAL.autoMouseMove) EVENTS.emitSingle("mouseMove")
    this.checkGamepadAxes()
  }
  private checkGamepadAxes() {
    if (LIBRARY.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone, INPUT)) {
      this.gamepadAxesMoved = true
    } else {
      // first time not moved
      if (this.gamepadAxesMoved && GLOBAL.lastActiveDevice === "gamepad") {
        SH.hero.MOVE.finaldestination = _.cloneDeep(SH.hero.POSITION)
      }
      this.gamepadAxesMoved = false
    }
  }
  // TODO anything
  mouseMove() {
    if (INTERFACE.talkHover) return
    SH.hero.STATE.track = false
    SH.hero.STATE.cast = false
    SH.hero
    const distance = COORD.distance(
      COORD.conterOfScreen(),
      COORD.mouseOfScreen()
    )
    if (distance < 10) {
      SH.hero.MOVE.finaldestination = _.cloneDeep(SH.hero.POSITION)
      return
    }
    const x = COORD.mousePosition().x
    const y = COORD.mousePosition().y
    if (COORD.isWalkable(x, y)) {
      SH.hero.MOVE.finaldestination = COORD.mousePosition()
    }
  }
  private gamepadMoveTries = 0
  gamepadMove() {
    const elapsedMS = LOOP.elapsedMS
    if (
      SH.hero.STATE.active === "track" &&
      elapsedMS < SH.hero.STATE.lastChangeMS + this.preventGamepadMoveMS &&
      elapsedMS > this.lastMobKilledMS + this.preventGamepadMoveMS
    ) {
      return
    }
    SH.hero.STATE.track = false
    SH.hero.STATE.cast = false
    this.gamepadMoveTries = 0
    this.gamepadMoveLogic()
  }
  private gamepadMoveLogic(otherRatio = 1) {
    if (!SH.hero) return
    const speedPerTick = COORD.speedPerTick(SH.hero)
    const axesVector = COORD.vector(
      INPUT.gamepad.axes[0],
      INPUT.gamepad.axes[1]
    )
    const angle = axesVector.angle
    let ratio = axesVector.distance
    ratio = _.clamp(ratio, 1)
    const vectorToFinalDestination = COORD.vectorFromAngle(
      angle,
      speedPerTick * LOOP.fps * 2
    )
    const hero = SH.hero
    const possibleDestinationX =
      hero.POSITION.x + vectorToFinalDestination.x * ratio * otherRatio
    const possibleDestinationY =
      hero.POSITION.y + vectorToFinalDestination.y * ratio * otherRatio
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
    hero.MOVE.finaldestination.x = possibleDestinationX
    hero.MOVE.finaldestination.y = possibleDestinationY
    this.gamepadAxesMoved = true
  }
  private canMove(entity) {
    if (
      !entity.MOVE ||
      !entity.STATE ||
      !entity.MOVE.destination ||
      !entity.MOVE.finaldestination
    ) {
      return false
    }
    if (entity.STATE.active === "cast" || entity.STATE.active === "dead") {
      return false
    }
    return true
  }
  move(entity) {
    if (!this.canMove(entity)) return
    const speedPerTick = COORD.speedPerTick(entity)
    const displacement = COORD.vectorFromPoints(
      entity.POSITION,
      entity.MOVE.destination
    )
    const finaldisplacement = COORD.vectorFromPoints(
      entity.POSITION,
      entity.MOVE.finaldestination
    )
    const finaldistance = finaldisplacement.distance
    const distance = displacement.distance
    if (distance < speedPerTick) {
      return
    }
    if (entity.attack && entity.TARGET.tracked) {
      const targetEntity = WORLD.entities.get(entity.TARGET.id)
      if (
        targetEntity &&
        finaldistance < targetEntity.SIZE.width / 2 + entity.attack.distance
      ) {
        return
      }
    }
    let ratio = _.clamp(finaldistance / 200, 1)
    ratio = Math.sqrt(ratio)
    ratio = _.clamp(ratio, 0.3, 1)
    if (SH.hero.STATE.track) ratio = 1
    const angle = displacement.angle
    const velocity = COORD.vectorFromAngle(angle, speedPerTick)
    entity.POSITION.x += velocity.x * ratio
    entity.POSITION.y += velocity.y * ratio
  }
}
export const MOVE = new Move()
