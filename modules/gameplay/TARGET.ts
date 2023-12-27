class Target {
    component = {
        id: 0,
        attackedId: 0,
        lastId: 0,
        lastCacheId: 0,
        _locked: false,
        // 🔧
        inject(ent, id) {
            Object.defineProperty(ent.TARGET, "ent", {
                get() {
                    return WORLD.entities.get(ent.TARGET.id)
                },
            })
            Object.defineProperty(ent.TARGET, "lastEntity", {
                get() {
                    return WORLD.entities.get(ent.TARGET.lastId)
                },
            })
            Object.defineProperty(ent.TARGET, "attackedEntity", {
                get() {
                    return WORLD.entities.get(ent.TARGET.attackedId)
                },
            })
            Object.defineProperty(ent.TARGET, "locked", {
                get() {
                    if (!ent.TARGET.id) return
                    return ent.TARGET._locked
                },
                set(value: boolean) {
                    if (value && !ent.TARGET.id) return
                    return (ent.TARGET._locked = value)
                },
            })
        },
    }
    heroAutoTargetDistance = 500
    mobsAutoTargetDistance = 300
    heroMaxTargetDistance = 1000
    mobsMaxTargetDistance = 430 // stop track
    init() {
        EVENTS.onSingle("lockTarget", () => {
            if (!HERO.ent.TARGET.id) return
            HERO.ent.TARGET.locked = !HERO.ent.TARGET.locked
            // reset final_des if it is on the TARGET - 📜 remove and all working fine, if still work after some time, just delete :)
            // if (
            //     HERO.ent.MOVE.final_des &&
            //     !HERO.ent.TARGET.locked &&
            //     HERO.ent.TARGET.ent.POS.x === HERO.ent.MOVE.final_des.x &&
            //     HERO.ent.TARGET.ent.POS.y === HERO.ent.MOVE.final_des.y
            // ) {
            //     HERO.ent.MOVE.final_des = _.cloneDeep(HERO.ent.POS)
            // }
            if (
                (GLOBAL.lastActiveDevice === "gamepad" &&
                    HERO.ent.STATE.cast) ||
                // only if lock is manually turned off after cast
                (HERO.ent.STATE.track &&
                    !HERO.ent.TARGET.locked &&
                    !GLOBAL.hoverId)
                // also lockTarget called a couple of times while key is pressed
            ) {
                HERO.ent.STATE.active = "idle"
                HERO.ent.STATE.cast = false
                HERO.ent.STATE.track = false
                HERO.ent.TARGET.id = null
                HERO.ent.TARGET.lock = false
                HERO.ent.MOVE.final_des = _.cloneDeep(HERO.ent.POS)
            }
            // when lock is used to lock a new TARGET immidiately
            if (GLOBAL.lastActiveDevice !== "gamepad") {
                if (!GLOBAL.hoverId || SETTINGS.echo.general.easyFight) return
                HERO.ent.TARGET.id = GLOBAL.hoverId
                HERO.ent.TARGET.locked = true
            }
        })
    }
    private updateLastTarget(ent) {
        if (ent.TARGET.id && ent.TARGET.id !== ent.TARGET.lastCacheId) {
            ent.TARGET.lastId = ent.TARGET.lastCacheId
            ent.TARGET.lastCacheId = ent.TARGET.id
        }
    }
    private updateKeepTrack(hero, id) {
        const lastHero = WORLD.last.entities.get(id)
        if (!lastHero) return
        if (
            !hero.STATE.track &&
            !hero.STATE.cast &&
            lastHero.STATE.track &&
            !SETTINGS.echo.general.keepLock
        ) {
            hero.TARGET.locked = false
        }
    }
    process() {
        if (!HERO.ent.TARGET) return
        MUSEUM.process_entity(["MOVE", "TARGET"], (ent, id) => {
            this.updateLastTarget(ent)
            if (ent.HERO) this.updateKeepTrack(ent, id)
            this.checkTargetDistance(ent, id)
            if (ent.STATE.active !== "track" && !ent.TARGET.locked) {
                if (
                    !SETTINGS.echo.general.easyFight &&
                    ent.HERO &&
                    GLOBAL.lastActiveDevice !== "gamepad"
                ) {
                    return
                }

                // work on all entities and hero with gamepad
                this.autoTarget(ent, id)
            }
        })
        if (
            GLOBAL.lastActiveDevice === "gamepad" &&
            LIBRARY.deadZoneExceed(
                SETTINGS.inputOther.gamepad.deadZone,
                INPUT
            ) &&
            !HERO.ent.TARGET.locked
        ) {
            // overwrites autoTarget for hero with gamepad axes
            this.targetByGamepadAxes()
        }
        if (
            GLOBAL.lastActiveDevice !== "gamepad" &&
            !GLOBAL.autoMove &&
            !HERO.ent.TARGET.locked
        ) {
            this.targetByMouse()
        }
    }
    targetByMouse() {
        if (SETTINGS.echo.general.easyFight && !GLOBAL.hoverId) return
        HERO.ent.TARGET.id = GLOBAL.hoverId
    }
    private checkTargetDistance(ent, id) {
        if (!ent.TARGET.id || !ent.TARGET.ent) return
        const distance = COORD.distance(ent.POS, ent.TARGET.ent.POS)
        let maxDistance = 0
        if (ent.HERO) maxDistance = this.heroMaxTargetDistance
        else maxDistance = this.mobsMaxTargetDistance
        if (distance > maxDistance) ent.TARGET.id = undefined
    }
    autoTarget(ent, id) {
        let minDistance = Infinity
        WORLD.entities.forEach((otherEntity, otherId) => {
            if (id === otherId || !otherEntity.MOVE) return
            if (otherEntity.STATE.active === "dead") return
            if (!ent.HERO && ent.ATTRIBUTES.mood === "peaceful") {
                return
            }
            const distance = COORD.distance(ent.POS, otherEntity.POS)
            if (distance < minDistance) {
                minDistance = distance
                ent.TARGET.id = otherId
            }
        })
        let autoTargetDistance = this.mobsAutoTargetDistance
        if (ent.HERO) autoTargetDistance = this.heroAutoTargetDistance
        if (minDistance > autoTargetDistance) {
            ent.TARGET.id = undefined
        }
    }
    targetByGamepadAxes() {
        const axesVector = COORD.vector(
            INPUT.gamepad.axes[0],
            INPUT.gamepad.axes[1]
        )
        const axesAngle = axesVector.angle
        let minAngle = Infinity
        let closestEntityId = 0
        // group to choose closest by distance not by angle if angle is small
        const closestGroup: number[] = []
        const correspondDistances: number[] = []
        const angleToGroup = 0.2 // about 12 degrees
        MUSEUM.process_entity(["NONHERO", "MOVE"], (ent, id) => {
            if (ent.STATE.active === "dead") return
            const distance = COORD.distance(HERO.ent.POS, ent.POS)
            if (distance > 750) return
            const entityAngle = COORD.angle(HERO.ent.POS, ent.POS)
            const angle = Math.abs(entityAngle - axesAngle)
            if (angle < angleToGroup) {
                closestGroup.push(id)
                correspondDistances.push(distance)
            }
            // already set closest if group wont be used
            if (angle < minAngle) {
                minAngle = angle
                closestEntityId = id
            }
        })
        if (closestGroup.length > 0) {
            let minDistance = Infinity
            closestGroup.forEach((id, index) => {
                const distance = correspondDistances[index]
                if (distance < minDistance) {
                    minDistance = distance
                    closestEntityId = id
                }
            })
        }
        HERO.ent.TARGET.id = closestEntityId
    }
}
export const TARGET = new Target()
