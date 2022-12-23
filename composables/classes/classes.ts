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
    if (this.x != this.nextX || this.y != this.nextY) {
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
    this.isHeroTarget = false
  }

  move() {
    // find intersection
    let minDistance = Infinity
    Game().entities.forEach((entity) => {
      if (entity.creature && entity.id != this.id) {
        let distance = findDistance(this, entity)
        if (distance < this.size + entity.size) {
          if (distance < minDistance) {
            this.intersectionId = entity.id
            minDistance = distance
            this.intersectionFrame = Game().frame
          }
        }
      }
    })

    // avoid intersection
    if (
      Game().frame < this.intersectionFrame + 60 &&
      !this.state.toLowerCase().includes("attack")
    ) {
      this.prevX = this.x
      this.prevY = this.y
      let intersection = getEntity(this.intersectionId)
      const angle = Math.atan2(this.y - intersection.y, this.x - intersection.x)
      this.x += (this.speed / 6) * Math.cos(angle)
      this.y += (this.speed / 6) * Math.sin(angle)
      setMirroredByMove(this)
    } else if (this.targetDistance > this.range) {
      super.move()
    }
  }

  setTarget() {
    // find target
    if (this.attitude === "agressive" && !this.targetId) {
      let minDistance = 400
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
    this.targetDistance > 500 ? (this.targetId = undefined) : {}
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

    if (this.prevX > this.x) {
      this.mirrored = true
    } else if (this.prevX < this.x) {
      this.mirrored = false
    }
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
            entity.isHeroTarget = true
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
