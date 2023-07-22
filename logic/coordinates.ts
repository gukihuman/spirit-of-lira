class Vector {
  x: number
  y: number

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
}

class Coordinates {
  // vectors
  vector(x: number, y: number) {
    return new Vector(x, y)
  }
  vectorFromPoints(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return new Vector(p2.x - p1.x, p2.y - p1.y)
  }
  vectorFromAngle(angle: number, distance: number) {
    return new Vector(distance * Math.cos(angle), distance * Math.sin(angle))
  }
  angle(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x)
  }
  distance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
    return Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2)
  }
  conterOfScreen() {
    return this.vector(960, 540)
  }
  mouseOfScreen() {
    if (!SYSTEM_DATA.states.firstMouseMove) return this.conterOfScreen()

    return COORDINATES.vector(
      INPUT.mouse.x / SYSTEM_DATA.states.gameWindowScale,
      INPUT.mouse.y / SYSTEM_DATA.states.gameWindowScale
    )
  }
  mousePosition() {
    const mousePosition = COORDINATES.mouseOfScreen()

    return this.vector(
      (mousePosition.x += SYSTEM_DATA.world.hero.position.x - 960),
      (mousePosition.y += SYSTEM_DATA.world.hero.position.y - 540)
    )
  }
}

export const COORDINATES = new Coordinates()
