// internal lib class
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
  public logWarning(message: string) {
    console.log("❗ " + this.timeNow() + ": " + message)
  }
  public cloneMapDeep(map: Map<any, any>) {
    const clonedMap = new Map()
    map.forEach((value, key) => {
      clonedMap.set(key, _.cloneDeep(value))
    })
    return clonedMap
  }
  public isWalkable(x: number, y: number) {
    const tileIndex = glib.tileIndexFromCoordinates(x, y)
    return (
      gcm.collisionArray[tileIndex] !== 2 && gcm.collisionArray[tileIndex] !== 3
    )
  }
  public generateRandomString(length) {
    let result = ""
    for (let i = 0; i < length; i++) {
      // Generate a random number between 0 and 9
      const randomNumber = _.random(0, 9)
      // Convert the number to a string and add it to the result
      result += randomNumber.toString()
    }
    return result
  }

  /**
   * Wrapper for pinia store that optionally accepts one or more watchers.
   * @param object - state object
   * @param args - watcher arrays that consist of a state property name and a handler function
   * @returns a pinia store with watchers and random name
   */
  store(
    object: { [index: string]: any },
    ...args: [string, (newValue?, oldValue?) => any][]
  ) {
    return defineStore(this.generateRandomString(10), () => {
      const state = _.mapValues(object, (key) => ref(key))

      args.forEach((watcher) => {
        watch(state[watcher[0]], watcher[1])
      })

      return state
    })
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
    return _.floor(_.toNumber(mapChunk) / 100) * 1000
  }
  public coordinateToTile(coordinate: number) {
    return _.floor(coordinate / 100)
  }
  public coordinateOffsetInTile(coordinate: number) {
    return coordinate % 100
  }
  public tileIndexFromEntity(entityInstance: gEntity) {
    if (!entityInstance.x || !entityInstance.y) return
    return (
      this.coordinateToTile(entityInstance.y) * 1000 +
      this.coordinateToTile(entityInstance.x)
    )
  }
  public tileIndexFromCoordinates(x: number, y: number) {
    return this.coordinateToTile(y) * 1000 + this.coordinateToTile(x)
  }
}

export const glib = new Lib()
