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
        inject(ent, id) {
            ent.MOVE.des = _.cloneDeep(ent.POS)
            ent.MOVE.final_des = _.cloneDeep(ent.POS)
            ent.MOVE.randomdesMS = LOOP.elapsed - _.random(0, 15_000)
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
        WORLD.entities.forEach((ent) => {
            if (!ent.MOVE) return
            this.move(ent)
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
                HERO.ent.MOVE.final_des = _.cloneDeep(HERO.ent.POS)
            }
            this.gamepadAxesMoved = false
        }
    }
    mouseMove() {
        if (CONTEXT.echo.interface) return
        if (INTERFACE.buttonHover) return
        HERO.ent.STATE.track = false
        HERO.ent.STATE.cast = false
        HERO.ent
        const distance = COORD.distance(
            COORD.conterOfScreen(),
            COORD.mouseOfScreen()
        )
        if (distance < 10) {
            HERO.ent.MOVE.final_des = _.cloneDeep(HERO.ent.POS)
            return
        }
        const x = COORD.mouse.x
        const y = COORD.mouse.y
        if (COLLISION.is_coord_clear({ x, y })) {
            HERO.ent.MOVE.final_des = COORD.mouse
        }
    }
    private gamepadMoveTries = 0
    gamepadMove() {
        const elapsed = LOOP.elapsed
        if (
            HERO.ent.STATE.active === "track" &&
            elapsed < HERO.ent.STATE.lastChangeMS + this.preventGamepadMoveMS &&
            elapsed > this.lastMobKilledMS + this.preventGamepadMoveMS
        ) {
            return
        }
        HERO.ent.STATE.track = false
        HERO.ent.STATE.cast = false
        this.gamepadMoveTries = 0
        this.gamepadMoveLogic()
    }
    private gamepadMoveLogic(otherRatio = 1) {
        if (!HERO.ent) return
        const speedPerTick = COORD.speedPerTick(HERO.ent)
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
        const hero = HERO.ent
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
    private canMove(ent) {
        if (!ent.MOVE || !ent.STATE || !ent.MOVE.des || !ent.MOVE.final_des) {
            return false
        }
        if (ent.STATE.active === "cast" || ent.STATE.active === "dead") {
            return false
        }
        return true
    }
    move(ent) {
        if (!this.canMove(ent)) return
        const speedPerTick = COORD.speedPerTick(ent)
        const displacement = COORD.vectorFromPoints(ent.POS, ent.MOVE.des)
        const finaldisplacement = COORD.vectorFromPoints(
            ent.POS,
            ent.MOVE.final_des
        )
        const finaldistance = finaldisplacement.distance
        const distance = displacement.distance
        if (distance < speedPerTick) {
            return
        }
        if (ent.attack && ent.TARGET.tracked) {
            const targetEntity = WORLD.entities.get(ent.TARGET.id)
            if (
                targetEntity &&
                finaldistance <
                    targetEntity.SIZE.width / 2 + ent.attack.distance
            ) {
                return
            }
        }
        let ratio = _.clamp(finaldistance / 200, 1)
        ratio = Math.sqrt(ratio)
        ratio = _.clamp(ratio, 0.3, 1)
        if (HERO.ent.STATE.track) ratio = 1
        const angle = displacement.angle
        const velocity = COORD.vectorFromAngle(angle, speedPerTick)
        ent.POS.x += velocity.x * ratio
        ent.POS.y += velocity.y * ratio
    }
}
export const MOVE = new Move()
