export default class {
  //
  init() {
    //
    // Preload filters to prevent lag
    const container = WORLD.getContainer(SYSTEM_DATA.world.heroId)

    if (container) {
      container.filters = [
        new PIXI_FILTERS.AdvancedBloomFilter({
          quality: 2,
          bloomScale: 0.23,
          blur: 6,
        }),
      ]
      container.filters.push(
        new PIXI_FILTERS.AdjustmentFilter({
          red: 1.4,
          saturation: 0.9,
          brightness: 0.7,
        })
      )
      setTimeout(() => {
        container.filters = []
      }, 0)
    }
  }

  process() {
    //
    this.updateHoverEntity()

    this.autoTarget() // work on all entities and hero with gamepad

    this.heroTargetByGamepad()

    if (!SYSTEM_DATA.states.autoMouseMove) this.heroTargetByMouse()

    this.updateHeroTargetFilter()
    this.targetUnlock() // work on all entities when target is far away

    this.updateTargetEntity()
    this.undefinedTarget()

    if (!SYSTEM_DATA.world.hero.target.id && !SYSTEM_DATA.states.inventory) {
      SYSTEM_DATA.states.target = false
    } else {
      SYSTEM_DATA.states.target = true
    }

    if (!SYSTEM_DATA.world.hero.target.locked)
      SYSTEM_DATA.states.targetLocked = false
    else SYSTEM_DATA.states.targetLocked = true

    if (SYSTEM_DATA.world.hero.target.id) {
      // 📜 change to percentage and handle ui states in some separate module
      SYSTEM_DATA.world.targetHealth =
        SYSTEM_DATA.world.hero.target.entity.attributes.health
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

      if (entity.target.attacked) {
        const targetEntity = WORLD.entities.get(entity.target.id)
        const distance = LIB.distance(entity.position, targetEntity.position)

        // follow distance is here
        if (id !== SYSTEM_DATA.world.heroId && distance > 430) {
          entity.target.id = undefined
          entity.target.locked = false
          entity.target.attacked = false
        } else {
          return
        }
      }

      if (entity.target.locked) return
      let minDistance = Infinity

      WORLD.entities.forEach((otherEntity, otherId) => {
        if (id === otherId || !otherEntity.state) return
        if (otherEntity.state.main === "dead") return
        if (
          entity.attributes.mood === otherEntity.attributes.mood &&
          id !== SYSTEM_DATA.world.heroId
        ) {
          return
        }
        if (
          id === SYSTEM_DATA.world.heroId &&
          INPUT.lastActiveDevice !== "gamepad"
        )
          return

        const distance = LIB.distance(entity.position, otherEntity.position)
        if (distance < minDistance) {
          minDistance = distance
          entity.target.id = otherId
        }

        if (
          entity.attributes.mood !== otherEntity.attributes.mood &&
          id !== SYSTEM_DATA.world.heroId
        ) {
          entity.target.attacked = true
        }
      })

      let maxTargetDistance = 300
      if (id === SYSTEM_DATA.world.heroId) maxTargetDistance = 540

      if (minDistance > maxTargetDistance) {
        entity.target.id = undefined
      }
    })
  }

  heroTargetByGamepad() {
    if (SYSTEM_DATA.world.hero.target.locked) return
    if (INPUT.lastActiveDevice !== "gamepad") return
    if (!LIB.deadZoneExceed(USER_DATA.settings.inputOther.gamepad.deadZone)) {
      return
    }

    const axesVector = LIB.vector(INPUT.gamepad.axes[0], INPUT.gamepad.axes[1])
    const axesAngle = axesVector.angle

    let minAngle = Infinity
    let closestEntityId = 0

    // group to choose closest by distance not by angle if angle is small
    const closestGroup: number[] = []
    const correspondDistances: number[] = []
    const angleToGroup = 0.2 // about 12 degrees

    WORLD.entities.forEach((entity, id) => {
      if (!entity.move || id === SYSTEM_DATA.world.heroId) return
      if (entity.state.main === "dead") return

      const distance = LIB.distance(
        SYSTEM_DATA.world.hero.position,
        entity.position
      )
      if (distance > 750) return

      const entityAngle = LIB.angle(
        SYSTEM_DATA.world.hero.position,
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

    SYSTEM_DATA.world.hero.target.id = closestEntityId
  }
  heroTargetByMouse() {
    if (SYSTEM_DATA.world.hero.target.locked || !SYSTEM_DATA.world.hoverId)
      return
    SYSTEM_DATA.world.hero.target.id = SYSTEM_DATA.world.hoverId
  }

  updateHoverEntity() {
    if (INPUT.lastActiveDevice === "gamepad") return

    const point = LIB.mousePoint()
    const heroPosition = SYSTEM_DATA.world.hero.position
    const intersections: number[] = []
    let hoverEntityId = 0

    WORLD.entities.forEach((entity, id) => {
      if (id === SYSTEM_DATA.world.heroId || !entity.move || !entity.size)
        return

      // how mutch height goes under the y coordinate
      let offset = entity.size.width / 4

      const position = entity.position

      const rect = {
        x: position.x - heroPosition.x + 960 - entity.size.width / 2,
        y: position.y - heroPosition.y + 540 - entity.size.height + offset,
        width: entity.size.width,
        height: entity.size.height,
      }
      const intersectX = point.x < rect.x + rect.width && point.x > rect.x
      const intersectY = point.y < rect.y + rect.height && point.y > rect.y

      if (intersectX && intersectY && entity.state.main !== "dead")
        intersections.push(id)
    })

    // in case there is more than one entity under the mouse
    if (intersections.length > 1) {
      let higherY = 0

      intersections.forEach((id) => {
        if (WORLD.entities.get(id).position.y > higherY) {
          higherY = WORLD.entities.get(id).position.y
        }
        hoverEntityId = id
      })
    } else if (intersections.length === 1) {
      hoverEntityId = intersections[0]
      //
    }

    SYSTEM_DATA.world.hoverId = hoverEntityId
    SYSTEM_DATA.world.hover = WORLD.entities.get(hoverEntityId)
  }

  lastContainer: Container | undefined

  updateHeroTargetFilter() {
    if (this.lastContainer) this.lastContainer.filters = []

    const id = SYSTEM_DATA.world.hero.target.id
    const entity = WORLD.entities.get(id)
    if (!id || !entity) return

    if (entity.attack.damageFilterStartMS + 100 > WORLD.loop.elapsedMS) return

    const container = WORLD.getLayer(id, "middle")

    if (container) {
      container.filters = [
        new PIXI_FILTERS.AdvancedBloomFilter({
          quality: 2,
          bloomScale: 0.23,
          blur: 6,
        }),
      ]
      if (SYSTEM_DATA.world.hero.target.attacked) {
        container.filters.push(
          new PIXI_FILTERS.AdjustmentFilter({
            red: 1.4,
            saturation: 0.9,
            brightness: 0.7,
          })
        )
      }
    }
    this.lastContainer = container
  }

  targetUnlock() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move) return
      if (!entity.target.id) entity.target.locked = false
    })

    const targetEntity = WORLD.entities.get(SYSTEM_DATA.world.hero.target.id)
    if (!targetEntity) return
    const distance = LIB.distance(
      SYSTEM_DATA.world.hero.position,
      targetEntity.position
    )

    if (distance > 1000) SYSTEM_DATA.world.hero.target.locked = false
  }
}
