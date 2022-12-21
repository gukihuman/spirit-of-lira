export class Entity {
  constructor(name, x, y) {
    Game().freeId++
    this.id = Game().freeId
    this.name = name
    this.x = x
    this.y = y
    this.targetX = x
    this.targetY = y
    this.prevX = x
    this.prevY = y
    this.speed = 0.1
    this.state = "idle"
    this.stateFrame = Game().frame
    this.mirrored = false
  }
  move() {
    if (this.x != this.targetX || this.y != this.targetY) {
      this.prevX = this.x
      this.prevY = this.y
      const angle = Math.atan2(this.y - this.targetY, this.x - this.targetX)
      this.x += (this.speed / 6) * Math.cos(angle) * -1
      this.y += (this.speed / 6) * Math.sin(angle) * -1
      if (this.prevX > this.x) {
        this.mirrored = true
      } else if (this.prevX < this.x) {
        this.mirrored = false
      }
    }
  }
}

export class Creature extends Entity {
  constructor(name, x, y) {
    super(name, x, y)
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
  }
  setTarget() {
    // find target
    if (this.attitude === "agressive" && !this.targetId) {
      let minDistance = 400
      Game().entities.forEach((entity) => {
        if (entity.type != this.type) {
          let distance = findDistance(this.x, this.y, entity.x, entity.y)
          distance -= entity.size
          if (distance < minDistance) {
            this.targetId = entity.id
            minDistance = distance
            this.targetDistance = distance
          }
        }
      })
    }
  }

  setTargetDistance() {
    if (this.targetId != undefined) {
      let target = Game().entities.find((target) => target.id === this.targetId)
      let distance = findDistance(this.x, this.y, target.x, target.y)
      distance -= target.size
      this.targetDistance = distance
    }
    this.targetDistance > 500 ? (this.targetId = undefined) : {}
  }

  setTargetXY() {
    if (this.targetId !== undefined) {
      let target = Game().entities.find((target) => target.id === this.targetId)
      this.targetX = target.x
      this.targetY = target.y
    } else {
      this.targetX = this.x
      this.targetY = this.y
    }
  }
}

export class Hero extends Creature {
  constructor(name, x, y) {
    super(name, x, y)
  }
  move() {
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
  }
}
