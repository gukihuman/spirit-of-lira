export default class {
  init() {
    EVENTS.onSingle("lockTarget", () => {
      const hero = WORLD.hero
      if (!hero.target.id) return

      hero.target.locked = !hero.target.locked

      // reset finaldestination if it is on the target
      // it might be undefined with gamepad so first check if it exists
      if (
        hero.move.finaldestination &&
        !hero.target.locked &&
        hero.target.entity.position.x === hero.move.finaldestination.x &&
        hero.target.entity.position.y === hero.move.finaldestination.y
      ) {
        hero.move.finaldestination = undefined
        hero.state.activeSingle = "idle"
      }
      if (!hero.target.locked) {
        hero.target.id = undefined
      }

      // in case lock is used to lock a new target immidiately
      // 📜 does checking target system existance is needed here?
      if (WORLD.systems.target && INPUT.lastActiveDevice !== "gamepad") {
        if (!WORLD.hoverId) return
        hero.target.id = WORLD.hoverId
        hero.target.locked = true
      }
    })
  }

  process() {
    this.autoTarget() // work on all entities and hero with gamepad
    this.heroTargetByGamepad()
    if (!GLOBAL.autoMouseMove) this.heroTargetByMouse()
    this.targetUnlock() // work on all entities when target is far away
    this.updateTargetEntity()
    this.undefinedTarget()
    if (!WORLD.hero.target.id && !INTERFACE.inventory) {
      INTERFACE.target = false
    } else {
      INTERFACE.target = true
    }
    if (!WORLD.hero.target.locked) INTERFACE.targetLocked = false
    else INTERFACE.targetLocked = true
    if (WORLD.hero.target.id) {
      INTERFACE.targetHealth = WORLD.hero.target.entity.attributes.health
      INTERFACE.targetMaxHealth =
        MODELS.entities[WORLD.hero.target.entity.name].attributes.health
    }
  }
  private undefinedTarget() {
    WORLD.entities.forEach((entity) => {
      if (entity.target && !entity.target.id) {
        entity.target.locked = false
        entity.target.attacked = false
        entity.target.entity = undefined
      }
    })
  }
  private updateTargetEntity() {
    WORLD.entities.forEach((entity) => {
      if (!entity.target) return
      entity.target.entity = WORLD.entities.get(entity.target.id)
    })
  }
  autoTarget() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      // if (entity.target.attacked) {
      //   const targetEntity = WORLD.entities.get(entity.target.id)
      //   const distance = COORDINATES.distance(
      //     entity.position,
      //     targetEntity.position
      //   )
      //   // follow distance is here
      //   if (id !== WORLD.heroId && distance > 430) {
      //     entity.target.id = undefined
      //     entity.target.locked = false
      //     entity.target.attacked = false
      //   } else {
      //     return
      //   }
      // }
      if (entity.target.locked) return
      let minDistance = Infinity
      WORLD.entities.forEach((otherEntity, otherId) => {
        if (id === otherId || !otherEntity.state) return
        if (otherEntity.state.active === "dead") return
        if (
          entity.attributes.mood === otherEntity.attributes.mood &&
          id !== WORLD.heroId
        ) {
          return
        }
        if (id === WORLD.heroId && INPUT.lastActiveDevice !== "gamepad") return
        const distance = COORDINATES.distance(
          entity.position,
          otherEntity.position
        )
        if (distance < minDistance) {
          minDistance = distance
          entity.target.id = otherId
        }
        if (
          entity.attributes.mood !== otherEntity.attributes.mood &&
          id !== WORLD.heroId
        ) {
        }
      })
      let maxTargetDistance = 300
      if (id === WORLD.heroId) maxTargetDistance = 540
      if (minDistance > maxTargetDistance) {
        entity.target.id = undefined
      }
    })
  }
  heroTargetByGamepad() {
    if (WORLD.hero.target.locked) return
    if (INPUT.lastActiveDevice !== "gamepad") return
    if (!LIB.deadZoneExceed(SETTINGS.inputOther.gamepad.deadZone)) {
      return
    }
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
  heroTargetByMouse() {
    if (WORLD.hero.target.locked || !WORLD.hoverId) return
    WORLD.hero.target.id = WORLD.hoverId
  }
  targetUnlock() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      if (!entity.target.id) entity.target.locked = false
    })

    const targetEntity = WORLD.entities.get(WORLD.hero.target.id)
    if (!targetEntity) return
    const distance = COORDINATES.distance(
      WORLD.hero.position,
      targetEntity.position
    )

    if (distance > 1000) WORLD.hero.target.locked = false
  }
}
