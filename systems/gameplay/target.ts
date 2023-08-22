export default class {
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
      if (INPUT.lastActiveDevice !== "gamepad" && hero.state.cast) {
        hero.state.cast = false
        hero.move.finaldestination = _.cloneDeep(hero.position)
      }
      // when lock is used to lock a new target immidiately
      if (INPUT.lastActiveDevice !== "gamepad") {
        if (!WORLD.hoverId) return
        hero.target.id = WORLD.hoverId
        hero.target.locked = true
        return
      }
    })
  }
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      this.checkTargetDistance(entity, id)
      if (entity.state.active !== "track" && !entity.target.locked) {
        if (!SETTINGS.gameplay.easyFight) {
          if (LIB.hero(id) && INPUT.lastActiveDevice !== "gamepad") return
        }
        // work on all entities and hero with gamepad
        this.autoTarget(entity, id)
      }
    })
    if (
      INPUT.lastActiveDevice === "gamepad" &&
      LIB.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone) &&
      !WORLD.hero.target.locked
    ) {
      // overwrites autoTarget for hero with gamepad axes
      this.targetByGamepadAxes()
    }
    if (
      INPUT.lastActiveDevice !== "gamepad" &&
      !GLOBAL.autoMouseMove &&
      !WORLD.hero.target.locked
    ) {
      this.targetByMouse()
    }
  }
  targetByMouse() {
    if (SETTINGS.gameplay.easyFight && !WORLD.hoverId) return
    WORLD.hero.target.id = WORLD.hoverId
  }
  private checkTargetDistance(entity, id) {
    if (!entity.target.id || !entity.target.entity) return
    const distance = COORDINATES.distance(
      entity.position,
      entity.target.entity.position
    )
    let maxDistance = 0
    if (LIB.hero(id)) maxDistance = this.heroMaxTargetDistance
    else maxDistance = this.mobsMaxTargetDistance
    if (distance > maxDistance) entity.target.id = undefined
  }
  autoTarget(entity, id) {
    let minDistance = Infinity
    WORLD.entities.forEach((otherEntity, otherId) => {
      if (id === otherId || !otherEntity.move) return
      if (otherEntity.state.active === "dead") return
      if (!LIB.hero(id) && entity.attributes.mood === "peaceful") {
        return
      }
      const distance = COORDINATES.distance(
        entity.position,
        otherEntity.position
      )
      if (distance < minDistance) {
        minDistance = distance
        entity.target.id = otherId
      }
    })
    let autoTargetDistance = this.mobsAutoTargetDistance
    if (LIB.hero(id)) autoTargetDistance = this.heroAutoTargetDistance
    if (minDistance > autoTargetDistance) {
      entity.target.id = undefined
    }
  }
  targetByGamepadAxes() {
    const axesVector = COORDINATES.vector(
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
      const distance = COORDINATES.distance(
        WORLD.hero.position,
        entity.position
      )
      if (distance > 750) return
      const entityAngle = COORDINATES.angle(
        WORLD.hero.position,
        entity.position
      )
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
