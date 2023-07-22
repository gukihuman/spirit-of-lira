export default class {
  //
  init() {
    //
    // Preload filters to prevent lag
    const container = WORLD.getContainer(STATES.heroId)

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

    if (!STATES.autoMouseMove) this.heroTargetByMouse()

    this.updateHeroTargetFilter()
    this.targetUnlock() // work on all entities when target is far away

    this.updateTargetEntity()
    this.undefinedTarget()

    if (!STATES.hero.target.id && !STATES.inventory) {
      STATES.target = false
    } else {
      STATES.target = true
    }

    if (!STATES.hero.target.locked) STATES.targetLocked = false
    else STATES.targetLocked = true

    if (STATES.hero.target.id) {
      // 📜 change to percentage and handle ui states in some separate module
      STATES.targetHealth = STATES.hero.target.entity.attributes.health
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
        const distance = COORDINATES.distance(
          entity.position,
          targetEntity.position
        )

        // follow distance is here
        if (id !== STATES.heroId && distance > 430) {
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
          id !== STATES.heroId
        ) {
          return
        }
        if (id === STATES.heroId && INPUT.lastActiveDevice !== "gamepad") return

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
          id !== STATES.heroId
        ) {
          entity.target.attacked = true
        }
      })

      let maxTargetDistance = 300
      if (id === STATES.heroId) maxTargetDistance = 540

      if (minDistance > maxTargetDistance) {
        entity.target.id = undefined
      }
    })
  }

  heroTargetByGamepad() {
    if (STATES.hero.target.locked) return
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
      if (!entity.move || id === STATES.heroId) return
      if (entity.state.main === "dead") return

      const distance = COORDINATES.distance(
        STATES.hero.position,
        entity.position
      )
      if (distance > 750) return

      const entityAngle = COORDINATES.angle(
        STATES.hero.position,
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

    STATES.hero.target.id = closestEntityId
  }
  heroTargetByMouse() {
    if (STATES.hero.target.locked || !STATES.hoverId) return
    STATES.hero.target.id = STATES.hoverId
  }

  updateHoverEntity() {
    if (INPUT.lastActiveDevice === "gamepad") return

    const point = COORDINATES.mouseOfScreen()
    const heroPosition = STATES.hero.position
    const intersections: number[] = []
    let hoverEntityId = 0

    WORLD.entities.forEach((entity, id) => {
      if (id === STATES.heroId || !entity.move || !entity.size) return

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

    STATES.hoverId = hoverEntityId
    STATES.hover = WORLD.entities.get(hoverEntityId)
  }

  lastContainer: Container | undefined

  updateHeroTargetFilter() {
    if (this.lastContainer) this.lastContainer.filters = []

    const id = STATES.hero.target.id
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
      if (STATES.hero.target.attacked) {
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

    const targetEntity = WORLD.entities.get(STATES.hero.target.id)
    if (!targetEntity) return
    const distance = COORDINATES.distance(
      STATES.hero.position,
      targetEntity.position
    )

    if (distance > 1000) STATES.hero.target.locked = false
  }
}
