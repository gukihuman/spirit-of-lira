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
  public cloneMapDeep(map: Map<any, any>) {
    const clonedMap = new Map()
    map.forEach((value, key) => {
      clonedMap.set(key, _.cloneDeep(value))
    })
    return clonedMap
  }

  // vectors
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

  // coordinates
  public coordinateToMapChunk(coordinate: number) {
    return _.floor(coordinate / 1000)
  }
  public mapChunkToCoordinateX(mapChunk: string) {
    return (_.toNumber(mapChunk) % 100) * 1000
  }
  public mapChunkToCoordinateY(mapChunk: string) {
    return Math.floor(_.toNumber(mapChunk) / 100) * 1000
  }
  public coordinateToTile(coordinate: number) {
    return _.floor(coordinate / 100)
  }
  public coordinateOffsetInTile(coordinate: number) {
    return coordinate % 100
  }
  public tileIndexFromEntity(entityInstance: gEntityInstance) {
    return (
      this.coordinateToTile(entityInstance.y) * 1000 +
      this.coordinateToTile(entityInstance.x)
    )
  }
  public tileIndexFromCoordinates(x: number, y: number) {
    return this.coordinateToTile(y) * 1000 + this.coordinateToTile(x)
  }

  public setAnimationFrameBetweenStates(
    entity: any,
    fromState: string,
    toState: string,
    frame: number | "smooth" = "smooth"
  ) {
    //
    const lastEntityInstance = gcache.lastTick.entityInstances.get(entity.id)
    if (!lastEntityInstance) return

    if (entity.state === toState && lastEntityInstance.state === fromState) {
      //
      // smooth saves the order like between run and walk
      if (frame === "smooth") {
        let fromAnimatedSprite = gpm.getAnimationSprite(entity.id, fromState)
        let currentFrame = fromAnimatedSprite.currentFrame

        // increment to the next frame
        currentFrame++

        // +1 here is just to fit the same frame because index started from 0
        if (currentFrame + 1 > fromAnimatedSprite.totalFrames) currentFrame = 0

        gpm.getAnimationSprite(entity.id, toState).gotoAndPlay(currentFrame)
        console.log(gpm.getAnimationSprite(entity.id, fromState).currentFrame)
        console.log(gpm.getAnimationSprite(entity.id, toState).currentFrame)
      } else {
        gpm.getAnimationSprite(entity.id, toState).gotoAndPlay(frame)
      }
    }
  }
}

export const glib = new Lib()
