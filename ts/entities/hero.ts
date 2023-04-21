class Vector {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  static fromPoints(p1, p2) {
    return new Vector(p2.x - p1.x, p2.y - p1.y)
  }

  get length() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  normalize() {
    const length = this.length
    this.x /= length
    this.y /= length
    return this
  }

  scale(factor) {
    this.x *= factor
    this.y *= factor
    return this
  }

  add(v) {
    this.x += v.x
    this.y += v.y
    return this
  }

  subtract(v) {
    this.x -= v.x
    this.y -= v.y
    return this
  }
}

export default {
  name: "hero",
  sprite: new URL("/assets/entities/hero.json", import.meta.url).href,
  x: 0,
  y: 0,
  speed: 3,

  process: function () {
    if (gic.keyboard.pressed.includes("o")) {
      const centerPoint = new Vector(
        960 * gsd.states.gameWindowScale,
        540 * gsd.states.gameWindowScale
      )
      const mousePosition = new Vector(gic.mouse.x, gic.mouse.y)

      const direction = Vector.fromPoints(centerPoint, mousePosition)
        .normalize()
        .scale(this.speed)
      this.x += direction.x
      this.y += direction.y
    }
  },
} as gUniqueEntity
