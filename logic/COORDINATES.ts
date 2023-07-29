//
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
  //
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
  speedPerTick(entity: Entity) {
    return entity.move.speed * 10 * WORLD.loop.deltaSec
  }
  conterOfScreen() {
    return this.vector(960, 540)
  }

  mouseOfScreen() {
    if (!GLOBAL.firstMouseMove) return this.conterOfScreen()

    return COORDINATES.vector(
      INPUT.mouse.x / GLOBAL.gameWindowScale,
      INPUT.mouse.y / GLOBAL.gameWindowScale
    )
  }

  mousePosition() {
    const mousePosition = COORDINATES.mouseOfScreen()

    return this.vector(
      (mousePosition.x += WORLD.hero.position.x - 960),
      (mousePosition.y += WORLD.hero.position.y - 540)
    )
  }

  coordinateToChunk(coordinate: number) {
    return _.floor(coordinate / 1000)
  }

  chunkFromCoordinates(x: number, y: number) {
    const chunkX = this.coordinateToChunk(x)
    const chunkY = this.coordinateToChunk(y)
    return `${chunkY}${chunkX}`
  }

  chunkToCoordinateX(chunk: string) {
    return (_.toNumber(chunk) % 100) * 1000
  }

  chunkToCoordinateY(chunk: string) {
    return _.floor(_.toNumber(chunk) / 100) * 1000
  }

  coordinateToTile(coordinate: number) {
    return _.floor(coordinate / 20)
  }

  coordinateOffsetInTile(coordinate: number) {
    return coordinate % 20
  }

  tileToCoordinate(tile: number) {
    return tile * 20
  }

  isWalkable(x: number, y: number) {
    let tileX = this.coordinateToTile(x)
    let tileY = this.coordinateToTile(y)
    return (
      WORLD.systems.collision.collisionArray[tileY][tileX] !== 2 &&
      WORLD.systems.collision.collisionArray[tileY][tileX] !== 3
    )
  }
  isGreenTile(tile: { x: number; y: number }) {
    return WORLD.systems.collision.collisionArray[tile.y][tile.x] === 1
  }
}

export const COORDINATES = new Coordinates()
