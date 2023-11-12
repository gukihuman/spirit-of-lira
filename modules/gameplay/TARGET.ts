class Target {
  component = {
    id: 0,
    _locked: false,
    // 🔧
    inject(entity, id) {
      Object.defineProperty(entity.TARGET, "entity", {
        get() {
          return WORLD.entities.get(entity.TARGET.id)
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
      const hero = SH.hero
      if (!hero.TARGET.id) return
      hero.TARGET.locked = !hero.TARGET.locked
      // reset finaldestination if it is on the TARGET
      if (
        hero.MOVE.finaldestination &&
        !hero.TARGET.locked &&
        hero.TARGET.entity.POSITION.x === hero.MOVE.finaldestination.x &&
        hero.TARGET.entity.POSITION.y === hero.MOVE.finaldestination.y
      ) {
        hero.MOVE.finaldestination = _.cloneDeep(hero.POSITION)
      }
      if (GLOBAL.lastActiveDevice !== "gamepad" && hero.STATE.cast) {
        hero.STATE.cast = false
        hero.MOVE.finaldestination = _.cloneDeep(hero.POSITION)
      }
      // when lock is used to lock a new TARGET immidiately
      if (GLOBAL.lastActiveDevice !== "gamepad") {
        if (!GLOBAL.hoverId) return
        hero.TARGET.id = GLOBAL.hoverId
        hero.TARGET.locked = true
        return
      }
    })
  }
  process() {
    if (!SH.hero.TARGET) return
    WORLD.entities.forEach((entity, id) => {
      if (!entity.MOVE) return
      this.checkTargetDistance(entity, id)
      if (entity.STATE.active !== "track" && !entity.TARGET.locked) {
        if (!SETTINGS.gameplay.easyFight) {
          if (entity.HERO && GLOBAL.lastActiveDevice !== "gamepad") return
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
      !GLOBAL.autoMouseMove &&
      !SH.hero.TARGET.locked
    ) {
      this.targetByMouse()
    }
  }
  targetByMouse() {
    if (SETTINGS.gameplay.easyFight && !GLOBAL.hoverId) return
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
