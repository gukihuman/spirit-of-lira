class Target {
  heroAutoTargetDistance = 500
  mobsAutoTargetDistance = 300
  heroMaxTargetDistance = 1000
  mobsMaxTargetDistance = 430 // stop track
  init() {
    EVENTS.onSingle("lockTarget", () => {
      const hero = WORLD.hero
      if (!hero.target.id) return
      hero.target.locked = !hero.target.locked
      // reset finaldestination if it is on the target
      if (
        hero.move.finaldestination &&
        !hero.target.locked &&
        hero.target.entity.position.x === hero.move.finaldestination.x &&
        hero.target.entity.position.y === hero.move.finaldestination.y
      ) {
        hero.move.finaldestination = _.cloneDeep(hero.position)
      }
      if (GLOBAL.lastActiveDevice !== "gamepad" && hero.state.cast) {
        hero.state.cast = false
        hero.move.finaldestination = _.cloneDeep(hero.position)
      }
      // when lock is used to lock a new target immidiately
      if (GLOBAL.lastActiveDevice !== "gamepad") {
        if (!GLOBAL.hoverId) return
        hero.target.id = GLOBAL.hoverId
        hero.target.locked = true
        return
      }
    })
  }
  process() {
    if (!WORLD.hero.target) return
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      this.checkTargetDistance(entity, id)
      if (entity.state.active !== "track" && !entity.target.locked) {
        if (!SETTINGS.gameplay.easyFight) {
          if (WORLD.isHero(id) && GLOBAL.lastActiveDevice !== "gamepad") return
        }
        // work on all entities and hero with gamepad
        this.autoTarget(entity, id)
      }
    })
    if (
      GLOBAL.lastActiveDevice === "gamepad" &&
      LIB.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone, INPUT) &&
      !WORLD.hero.target.locked
    ) {
      // overwrites autoTarget for hero with gamepad axes
      this.targetByGamepadAxes()
    }
    if (
      GLOBAL.lastActiveDevice !== "gamepad" &&
      !GLOBAL.autoMouseMove &&
      !WORLD.hero.target.locked
    ) {
      this.targetByMouse()
    }
  }
  targetByMouse() {
    if (SETTINGS.gameplay.easyFight && !GLOBAL.hoverId) return
    WORLD.hero.target.id = GLOBAL.hoverId
  }
  private checkTargetDistance(entity, id) {
    if (!entity.target.id || !entity.target.entity) return
    const distance = COORD.distance(
      entity.position,
      entity.target.entity.position
    )
    let maxDistance = 0
    if (WORLD.isHero(id)) maxDistance = this.heroMaxTargetDistance
    else maxDistance = this.mobsMaxTargetDistance
    if (distance > maxDistance) entity.target.id = undefined
  }
  autoTarget(entity, id) {
    let minDistance = Infinity
    WORLD.entities.forEach((otherEntity, otherId) => {
      if (id === otherId || !otherEntity.move) return
      if (otherEntity.state.active === "dead") return
      if (!WORLD.isHero(id) && entity.attributes.mood === "peaceful") {
        return
      }
      const distance = COORD.distance(entity.position, otherEntity.position)
      if (distance < minDistance) {
        minDistance = distance
        entity.target.id = otherId
      }
    })
    let autoTargetDistance = this.mobsAutoTargetDistance
    if (WORLD.isHero(id)) autoTargetDistance = this.heroAutoTargetDistance
    if (minDistance > autoTargetDistance) {
      entity.target.id = undefined
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
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move || id === WORLD.heroId) return
      if (entity.state.active === "dead") return
      const distance = COORD.distance(WORLD.hero.position, entity.position)
      if (distance > 750) return
      const entityAngle = COORD.angle(WORLD.hero.position, entity.position)
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
    WORLD.hero.target.id = closestEntityId
  }
}
export const TARGET = new Target()
