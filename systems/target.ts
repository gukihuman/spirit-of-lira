export default class target {
  //
  process() {
    //
    this.autoTarget() // work on all entities and hero with gamepad

    this.heroTargetByGamepad()
    this.heroTargetByMouse()

    this.updateHeroTargetFilter() // bloom
    this.targetUnlock() // work on all entities when target is far away
  }

  autoTarget() {
    gworld.entities.forEach((entity, id) => {
      if (!entity.alive) return
      if (entity.alive.targetLocked) return
      let minDistance = Infinity

      gworld.entities.forEach((otherEntity, otherId) => {
        if (id === otherId || !otherEntity.alive) return
        if (
          entity.alive.faction === otherEntity.alive.faction &&
          id !== gg.heroId
        ) {
          return
        }
        if (id === gg.heroId && gic.lastActiveDevice !== "gamepad") return

        const distance = glib.distance(entity.position, otherEntity.position)
        if (distance < minDistance) {
          minDistance = distance
          entity.alive.targetEntityId = otherId
        }
      })

      let maxTargetDistance = 300
      if (id === gg.heroId) maxTargetDistance = 540

      if (minDistance > maxTargetDistance) {
        entity.alive.targetEntityId = undefined
      }
    })
  }

  heroTargetByGamepad() {
    if (gg.hero.alive.targetLocked) return
    if (gic.lastActiveDevice !== "gamepad") return
    if (!glib.deadZoneExceed(gud.settings.inputOther.gamepad.deadZone)) {
      return
    }

    const axesVector = glib.vector(gic.gamepad.axes[0], gic.gamepad.axes[1])
    const axesAngle = axesVector.angle

    let minAngle = Infinity
    let closestEntityId = 0

    // group to choose closest by distance not by angle if angle is small
    const closestGroup: number[] = []
    const correspondDistances: number[] = []
    const angleToGroup = 0.3 // about 20 degrees

    gworld.entities.forEach((entity, id) => {
      if (!entity.alive || id === gg.heroId) return

      const distance = glib.distance(gg.hero.position, entity.position)
      if (distance > 540) return

      const entityAngle = glib.angle(gg.hero.position, entity.position)
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

    gg.hero.alive.targetEntityId = closestEntityId
  }

  heroTargetByMouse() {
    if (gg.hero.alive.targetLocked) return
    if (gic.lastActiveDevice === "gamepad") return

    const point = glib.mousePoint()
    const heroPosition = gg.hero.position
    const intersections: number[] = []
    let targetEntityId = 0

    gworld.entities.forEach((entity, id) => {
      if (id === gg.heroId || !entity.alive) return

      // how mutch height goes under the y coordinate
      let offset = entity.alive.width / 4

      const position = entity.position

      const rect = {
        x: position.x - heroPosition.x + 960 - entity.alive.width / 2,
        y: position.y - heroPosition.y + 540 - entity.alive.height + offset,
        width: entity.alive.width,
        height: entity.alive.height,
      }
      const intersectX = point.x < rect.x + rect.width && point.x > rect.x
      const intersectY = point.y < rect.y + rect.height && point.y > rect.y

      if (intersectX && intersectY) intersections.push(id)
    })

    // in case there is more than one entity under the mouse
    if (intersections.length > 1) {
      let higherY = 0

      intersections.forEach((id) => {
        if (gworld.entities.get(id).position.y > higherY) {
          higherY = gworld.entities.get(id).position.y
        }
        targetEntityId = id
      })
    } else if (intersections.length === 1) {
      targetEntityId = intersections[0]
      //
    }

    gg.hero.alive.targetEntityId = targetEntityId
  }

  updateHeroTargetFilter() {
    const lastId = gg.lastHero.alive.targetEntityId
    const lastContainer = gpixi.getAnimationContainer(lastId)
    if (lastContainer) lastContainer.filters = []

    const id = gg.hero.alive.targetEntityId
    const container = gpixi.getAnimationContainer(id)

    if (container) {
      container.filters = [
        new PIXIfilters.AdvancedBloomFilter({
          bloomScale: 0.23,
          blur: 9,
        }),
      ]
    }
  }

  targetUnlock() {
    gworld.entities.forEach((entity, id) => {
      if (!entity.alive) return
      if (!entity.alive.targetEntityId) entity.alive.targetLocked = false
    })

    const targetEntity = gworld.entities.get(gg.hero.alive.targetEntityId)
    if (!targetEntity) return
    const distance = glib.distance(gg.hero.position, targetEntity.position)

    if (distance > 1000) gg.hero.alive.targetLocked = false
  }
}
