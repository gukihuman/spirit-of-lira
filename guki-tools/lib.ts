class Vector {
  public x: number
  public y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }
  get distance() {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }
  get angle() {
    return Math.atan2(this.y, this.x)
  }
  normalize() {
    const length = this.distance
    this.x /= length
    this.y /= length
    return this
  }
}

class Lib {
  // returns string with time in the format 22:43:54
  public timeNow(): string {
    function _pad(num: number): string {
      return String(num).padStart(2, "0")
    }
    const now = new Date()
    const current: string =
      _pad(now.getHours()) +
      ":" +
      _pad(now.getMinutes()) +
      ":" +
      _pad(now.getSeconds())
    return current
  }

  // vectors and coordinates
  public vector(x: number, y: number) {
    return new Vector(x, y)
  }
  public vectorFromPoints(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    return new Vector(p2.x - p1.x, p2.y - p1.y)
  }
  public vectorFromAngle(angle: number, distance: number) {
    return new Vector(distance * Math.cos(angle), distance * Math.sin(angle))
  }
  public angle(x: number, y: number) {
    return Math.atan2(y, x)
  }
  public angleFromPoints(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
  }
  public distanceFromPoints(
    p1: { x: number; y: number },
    p2: { x: number; y: number }
  ) {
    return Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2)
  }
  public get centerPoint() {
    return this.vector(960, 540)
  }
  public get mousePoint() {
    return glib.vector(
      gic.mouse.x / gsd.states.gameWindowScale,
      gic.mouse.y / gsd.states.gameWindowScale
    )
  }
  public coordinateToMapChunk(coordinate: number) {
    return _.floor(coordinate / 1000)
  }
}

export const glib = new Lib()
