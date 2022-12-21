class Entity {
  constructor(name, x, y, frame) {
    this.name = name
    this.x = x
    this.y = y
    this.targetX = x
    this.targetY = y
    this.prevX = x
    this.prevY = y
    this.speed = 0.1
    this.state = "idle"
    this.stateFrame = frame
    this.mirrored = false
  }
  move() {
    this.prevX = x
    this.prevY = y
    const angle = Math.atan2(this.y - this.targetY, this.x - this.targetX)
    this.x += (this.speed / 60) * Math.cos(angle)
    this.y += (this.speed / 60) * Math.sin(angle)
    if (this.prevX > this.x) {
      this.mirrored = true
    } else if (this.prevX < this.x) {
      this.mirrored = false
    }
  }
}

class Hero extends Entity {
  constructor(...args) {
    super(...args)
  }
}
