class Target {
  component = {
    id: 0,
    attackedId: 0,
    lastId: 0,
    lastCacheId: 0,
    _locked: false,
    // 🔧
    inject(entity, id) {
      Object.defineProperty(entity.TARGET, "entity", {
        get() {
          return WORLD.entities.get(entity.TARGET.id)
        },
      })
      Object.defineProperty(entity.TARGET, "lastEntity", {
        get() {
          return WORLD.entities.get(entity.TARGET.lastId)
        },
      })
      Object.defineProperty(entity.TARGET, "attackedEntity", {
        get() {
          return WORLD.entities.get(entity.TARGET.attackedId)
        },
      })
      Object.defineProperty(entity.TARGET, "locked", {
        get() {
          if (!entity.TARGET.id) return
          return entity.TARGET._locked
        },
        set(value: boolean) {
          if (value && !entity.TARGET.id) return
          return (entity.TARGET._locked = value)
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
      if (!SH.hero.TARGET.id) return
      SH.hero.TARGET.locked = !SH.hero.TARGET.locked
      // reset finaldestination if it is on the TARGET
      if (
        SH.hero.MOVE.finaldestination &&
        !SH.hero.TARGET.locked &&
        SH.hero.TARGET.entity.POSITION.x === SH.hero.MOVE.finaldestination.x &&
        SH.hero.TARGET.entity.POSITION.y === SH.hero.MOVE.finaldestination.y
      ) {
        SH.hero.MOVE.finaldestination = _.cloneDeep(SH.hero.POSITION)
      }
      if (
        (GLOBAL.lastActiveDevice === "gamepad" && SH.hero.STATE.cast) ||
        // only if lock is manually turned off after cast
        (SH.hero.STATE.track && !SH.hero.TARGET.locked && !GLOBAL.hoverId)
        // also lockTarget called a couple of times while key is pressed
      ) {
        SH.hero.STATE.active = "idle"
        SH.hero.STATE.cast = false
        SH.hero.STATE.track = false
        SH.hero.TARGET.id = null
        SH.hero.TARGET.lock = false
        SH.hero.MOVE.finaldestination = _.cloneDeep(SH.hero.POSITION)
      }
      // when lock is used to lock a new TARGET immidiately
      if (GLOBAL.lastActiveDevice !== "gamepad") {
        if (!GLOBAL.hoverId || SETTINGS.general.easyFight) return
        SH.hero.TARGET.id = GLOBAL.hoverId
        SH.hero.TARGET.locked = true
      }
    })
  }
  private updateLastTarget(entity) {
    if (entity.TARGET.id && entity.TARGET.id !== entity.TARGET.lastCacheId) {
      entity.TARGET.lastId = entity.TARGET.lastCacheId
      entity.TARGET.lastCacheId = entity.TARGET.id
    }
  }
  private updateKeepTrack(hero, id) {
    const lastHero = LAST.entities.get(id)
    if (!lastHero) return
    if (
      !hero.STATE.track &&
      !hero.STATE.cast &&
      lastHero.STATE.track &&
      !SETTINGS.general.keepLock
    ) {
      hero.TARGET.locked = false
    }
  }
  process() {
    if (!SH.hero.TARGET) return
    MUSEUM.processEntity(["MOVE", "TARGET"], (entity, id) => {
      this.updateLastTarget(entity)
      if (entity.HERO) this.updateKeepTrack(entity, id)
      this.checkTargetDistance(entity, id)
      if (entity.STATE.active !== "track" && !entity.TARGET.locked) {
        if (
          !SETTINGS.general.easyFight &&
          entity.HERO &&
          GLOBAL.lastActiveDevice !== "gamepad"
        ) {
          return
        }

        // work on all entities and hero with gamepad
        this.autoTarget(entity, id)
      }
    })
    if (
      GLOBAL.lastActiveDevice === "gamepad" &&
      LIBRARY.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone, INPUT) &&
      !SH.hero.TARGET.locked
    ) {
      // overwrites autoTarget for hero with gamepad axes
      this.targetByGamepadAxes()
    }
    if (
      GLOBAL.lastActiveDevice !== "gamepad" &&
      !GLOBAL.autoMove &&
      !SH.hero.TARGET.locked
    ) {
      this.targetByMouse()
    }
  }
  targetByMouse() {
    if (SETTINGS.general.easyFight && !GLOBAL.hoverId) return
    SH.hero.TARGET.id = GLOBAL.hoverId
  }
  private checkTargetDistance(entity, id) {
    if (!entity.TARGET.id || !entity.TARGET.entity) return
    const distance = COORD.distance(
      entity.POSITION,
      entity.TARGET.entity.POSITION
    )
    let maxDistance = 0
    if (entity.HERO) maxDistance = this.heroMaxTargetDistance
    else maxDistance = this.mobsMaxTargetDistance
    if (distance > maxDistance) entity.TARGET.id = undefined
  }
  autoTarget(entity, id) {
    let minDistance = Infinity
    WORLD.entities.forEach((otherEntity, otherId) => {
      if (id === otherId || !otherEntity.MOVE) return
      if (otherEntity.STATE.active === "dead") return
      if (!entity.HERO && entity.ATTRIBUTES.mood === "peaceful") {
        return
      }
      const distance = COORD.distance(entity.POSITION, otherEntity.POSITION)
      if (distance < minDistance) {
        minDistance = distance
        entity.TARGET.id = otherId
      }
    })
    let autoTargetDistance = this.mobsAutoTargetDistance
    if (entity.HERO) autoTargetDistance = this.heroAutoTargetDistance
    if (minDistance > autoTargetDistance) {
      entity.TARGET.id = undefined
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
    MUSEUM.processEntity(["NONHERO", "MOVE"], (entity, id) => {
      if (entity.STATE.active === "dead") return
      const distance = COORD.distance(SH.hero.POSITION, entity.POSITION)
      if (distance > 750) return
      const entityAngle = COORD.angle(SH.hero.POSITION, entity.POSITION)
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
    SH.hero.TARGET.id = closestEntityId
  }
}
export const TARGET = new Target()
