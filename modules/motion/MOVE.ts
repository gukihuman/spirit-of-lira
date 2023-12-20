class Move {
    component = {
        speed: 5,

        des: null, // destination
        final_des: null,
        path: [],

        randomdesMS: 0,
        setMousePointOnWalkableMS: 0,

        // 🔧
        depend: ["POS"],
        trigger: ["TARGET", "ATTRIBUTES", "SHADOW", "STATE"],
        inject(entity, id) {
            entity.MOVE.final_des = _.cloneDeep(entity.POS)
            entity.MOVE.randomdesMS = LOOP.elapsed - _.random(0, 15_000)
        },
    }

    private preventGamepadMoveMS = 500 // disable axes after start track
    // used to not prevent gamepad move after kill, updates when hero kill mobs
    lastMobKilledMS = 0
    private gamepadAxesMoved = false
    init() {
        EVENTS.onSingle("mouseMove", () => this.mouseMove())
        EVENTS.onSingle("gamepadMove", () => this.gamepadMove())
        EVENTS.onSingle("autoMove", () => {
            if (!GLOBAL.firstUserGesture) return
            GLOBAL.autoMove = !GLOBAL.autoMove
        })
    }
    process() {
        if (CONTEXT.echo.novel) return
        WORLD.entities.forEach((entity) => {
            if (!entity.MOVE) return
            this.move(entity)
        })
        if (GLOBAL.autoMove) EVENTS.emitSingle("mouseMove")
        this.checkGamepadAxes()
    }
    private checkGamepadAxes() {
        if (
            LIBRARY.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone, INPUT)
        ) {
            this.gamepadAxesMoved = true
        } else {
            // first time not moved
            if (
                this.gamepadAxesMoved &&
                GLOBAL.lastActiveDevice === "gamepad"
            ) {
                HERO.entity.MOVE.final_des = _.cloneDeep(HERO.entity.POS)
            }
            this.gamepadAxesMoved = false
        }
    }
    mouseMove() {
        if (CONTEXT.echo.interface) return
        if (INTERFACE.buttonHover) return
        HERO.entity.STATE.track = false
        HERO.entity.STATE.cast = false
        HERO.entity
        const distance = COORD.distance(
            COORD.conterOfScreen(),
            COORD.mouseOfScreen()
        )
        if (distance < 10) {
            HERO.entity.MOVE.final_des = _.cloneDeep(HERO.entity.POS)
            return
        }
        const x = COORD.mouse.x
        const y = COORD.mouse.y
        if (COLLISION.is_coord_clear({ x, y })) {
            HERO.entity.MOVE.final_des = COORD.mouse
        }
    }
    private gamepadMoveTries = 0
    gamepadMove() {
        const elapsed = LOOP.elapsed
        if (
            HERO.entity.STATE.active === "track" &&
            elapsed <
                HERO.entity.STATE.lastChangeMS + this.preventGamepadMoveMS &&
            elapsed > this.lastMobKilledMS + this.preventGamepadMoveMS
        ) {
            return
        }
        HERO.entity.STATE.track = false
        HERO.entity.STATE.cast = false
        this.gamepadMoveTries = 0
        this.gamepadMoveLogic()
    }
    private gamepadMoveLogic(otherRatio = 1) {
        if (!HERO.entity) return
        const speedPerTick = COORD.speedPerTick(HERO.entity)
        const axesVector = COORD.vector(
            INPUT.gamepad.axes[0],
            INPUT.gamepad.axes[1]
        )
        const angle = axesVector.angle
        let ratio = axesVector.distance
        ratio = _.clamp(ratio, 1)
        const vectorToFinaldes = COORD.vectorFromAngle(
            angle,
            speedPerTick * LOOP.fps * 2
        )
        const hero = HERO.entity
        const possibledesX =
            hero.POS.x + vectorToFinaldes.x * ratio * otherRatio
        const possibledesY =
            hero.POS.y + vectorToFinaldes.y * ratio * otherRatio
        if (
            !COLLISION.is_coord_clear({
                x: possibledesX,
                y: possibledesY,
            }) &&
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
        hero.MOVE.final_des.x = possibledesX
        hero.MOVE.final_des.y = possibledesY
        this.gamepadAxesMoved = true
    }
    private canMove(entity) {
        if (
            !entity.MOVE ||
            !entity.STATE ||
            !entity.MOVE.des ||
            !entity.MOVE.final_des
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
        const displacement = COORD.vectorFromPoints(entity.POS, entity.MOVE.des)
        const finaldisplacement = COORD.vectorFromPoints(
            entity.POS,
            entity.MOVE.final_des
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
                finaldistance <
                    targetEntity.SIZE.width / 2 + entity.attack.distance
            ) {
                return
            }
        }
        let ratio = _.clamp(finaldistance / 200, 1)
        ratio = Math.sqrt(ratio)
        ratio = _.clamp(ratio, 0.3, 1)
        if (HERO.entity.STATE.track) ratio = 1
        const angle = displacement.angle
        const velocity = COORD.vectorFromAngle(angle, speedPerTick)
        entity.POS.x += velocity.x * ratio
        entity.POS.y += velocity.y * ratio
    }
}
export const MOVE = new Move()
