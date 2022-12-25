export class Entity {
  constructor(name, x, y) {
    Game().freeId++
    this.id = Game().freeId
    this.name = name
    this.x = x
    this.y = y
    this.nextX = x
    this.nextY = y
    this.prevX = x
    this.prevY = y
    this.speed = 0.1
    this.state = "idle"
    this.stateFrame = Game().frame
    this.mirrored = false
  }
  move() {
    if (
      (this.x != this.nextX || this.y != this.nextY) &&
      !this.state.includes("attack")
    ) {
      this.prevX = this.x
      this.prevY = this.y
      const angle = Math.atan2(this.y - this.nextY, this.x - this.nextX)
      this.x += (this.speed / 6) * Math.cos(angle) * -1
      this.y += (this.speed / 6) * Math.sin(angle) * -1
      setMirroredByMove(this)
    }
  }
}

export class Creature extends Entity {
  constructor(name, x, y) {
    super(name, x, y)
    this.creature = true
    this.type = CreatureInfo()[name].type || "enemy"
    this.attitude = CreatureInfo()[name].attitude || "peaceful"
    this.size = CreatureInfo()[name].size || 40
    this.breed = CreatureInfo()[name].breed || "animal"
    this.maxHealth = CreatureInfo()[name].maxHealth || 10
    this.maxMana = CreatureInfo()[name].maxMana || 0
    this.speed = CreatureInfo()[name].speed || 0.1
    this.attackSpeed = CreatureInfo()[name].attackSpeed || 50
    this.damageMin = CreatureInfo()[name].damageMin || 1
    this.damageMax = CreatureInfo()[name].damageMax || 2
    this.damageType = CreatureInfo()[name].damageType || "physical"
    this.range = CreatureInfo()[name].range || 80
    this.targetId = undefined
    this.targetDistance = Infinity
    this.intersectionId = 0
    this.intersectionFrame = undefined
    this.intersectionAngle = undefined
    this.isHeroTarget = false
  }

  move() {
    // find intersection and set best angle to avoid it based of target
    let minDistance = Infinity
    Game().entities.forEach((entity) => {
      if (
        entity.creature &&
        entity.id != this.id &&
        entity.name != "hero" &&
        Game().frame % Math.floor(20 * Math.random()) === 0
      ) {
        let distance = findDistance(this, entity)
        if (distance < this.size + entity.size) {
          if (distance < minDistance) {
            this.intersectionId = entity.id
            minDistance = distance
            this.intersectionFrame = Game().frame

            // find angle for avoiding intersection
            let cacheIntersectionAngle = Math.atan2(
              this.y - entity.y,
              this.x - entity.x
            )
            let cacheX = this.x
            let cacheY = this.y
            this.intersectionAngle += Math.PI / 2.2
            this.x += (this.speed / 6) * Math.cos(this.intersectionAngle)
            this.y += (this.speed / 6) * Math.sin(this.intersectionAngle)
            let target = getEntity(this.targetId)
            let posDistance = findDistance(this, target)

            this.intersectionAngle = cacheIntersectionAngle
            this.x = cacheX
            this.y = cacheY
            this.intersectionAngle -= Math.PI / 2.2
            this.x += (this.speed / 6) * Math.cos(this.intersectionAngle)
            this.y += (this.speed / 6) * Math.sin(this.intersectionAngle)
            let posDistance2 = findDistance(this, target)

            this.intersectionAngle = cacheIntersectionAngle
            this.x = cacheX
            this.y = cacheY

            if (posDistance < posDistance2) {
              this.intersectionAngle += Math.PI / 2.2 + 0.2 * Math.random()
            } else {
              this.intersectionAngle -= Math.PI / 2.2 - 0.2 * Math.random()
            }
          }
        }
      }
    })

    // avoid intersection
    if (
      Game().frame < this.intersectionFrame + 60 &&
      !this.state.toLowerCase().includes("attack") &&
      this.targetDistance > this.range
    ) {
      this.prevX = this.x
      this.prevY = this.y
      this.x += (this.speed / 6) * Math.cos(this.intersectionAngle)
      this.y += (this.speed / 6) * Math.sin(this.intersectionAngle)
      setMirroredByMove(this)
    } else if (
      (this.targetDistance > this.range &&
        this.state === "attack" &&
        Game().frame > this.stateFrame + 20) ||
      (this.targetDistance > this.range && !this.state.includes("attack"))
    ) {
      super.move()
    }
  }

  setTarget() {
    // find target
    if (this.attitude === "agressive" && !this.targetId) {
      let minDistance = 350
      Game().entities.forEach((entity) => {
        if (entity.creature && entity.type != this.type) {
          let distance = findDistance(this, entity)
          distance -= entity.size
          if (distance < minDistance) {
            this.targetId = entity.id
            minDistance = distance
            this.targetDistance = distance
          }
        }
      })
    }
    if (this.targetId) {
      let target = getEntity(this.targetId)
      let distance = findDistance(this, target)
      distance -= target.size
      this.targetDistance = distance
    }
    this.targetDistance > 450 ? (this.targetId = undefined) : {}
  }

  setNextXY() {
    if (this.targetId) {
      let target = Game().entities.find((target) => target.id === this.targetId)
      this.nextX = target.x
      this.nextY = target.y
    } else {
      this.nextX = this.x
      this.nextY = this.y
    }
  }
}

export class Hero extends Creature {
  constructor(name, x, y) {
    super(name, x, y)
  }
  move() {
    this.prevX = this.x
    this.prevY = this.y
    // LS x
    if (
      Gamepad().axes[0] <= -1 * Settings().deadZone ||
      Gamepad().axes[0] >= Settings().deadZone
    ) {
      this.x += (this.speed / 6) * Gamepad().axes[0]
    }

    // LS y
    if (
      Gamepad().axes[1] <= -1 * Settings().deadZone ||
      Gamepad().axes[1] >= Settings().deadZone
    ) {
      this.y += (this.speed / 6) * Gamepad().axes[1]
    }
    if (States().mouseScreen && States().mouseMove) {
      const angle = Math.atan2(this.y - Mouse().y, this.x - Mouse().x)
      let distance = findDistance(this, Mouse())
      let distanceRatio = distance / 350
      distanceRatio > 1 ? (distanceRatio = 1) : {}
      if (distance > 40) {
        this.x += (this.speed / 6) * distanceRatio * Math.cos(angle) * -1
        this.y += (this.speed / 6) * distanceRatio * Math.sin(angle) * -1
      }
    }
    setMirroredByMove(this)
  }
  setTarget() {
    // find target
    if (!this.targetId) {
      let minDistance = Infinity
      Game().entities.forEach((entity) => {
        if (entity.creature && entity.type != this.type) {
          let distance = findDistance(this, entity)
          distance -= entity.size
          if (distance < minDistance) {
            this.targetId = entity.id
            minDistance = distance
            this.targetDistance = distance
          }
        }
      })
    }
    if (this.targetId) {
      let target = getEntity(this.targetId)
      target.isHeroTarget = true
      let distance = findDistance(this, target)
      distance -= target.size
      this.targetDistance = distance
    }
    this.targetDistance > this.range ? (this.targetId = undefined) : {}
  }
}
