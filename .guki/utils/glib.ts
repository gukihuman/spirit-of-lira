// internal lib class
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

class Lib {
  /** @returns string of time for example "22:43:54" */
  timeNow(): string {
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
  logWarning(message: string) {
    console.log("❗ " + this.timeNow() + ": " + message)
  }
  cloneMapDeep(map: Map<any, any>) {
    const clonedMap = new Map()
    map.forEach((value, key) => {
      if (value instanceof Map) {
        clonedMap.set(key, this.cloneMapDeep(value))
      } else {
        clonedMap.set(key, _.cloneDeep(value))
      }
    })
    return clonedMap
  }
  isWalkable(x: number, y: number) {
    const tileIndex = glib.tileIndexFromCoordinates(x, y)
    return (
      gcm.collisionArray[tileIndex] !== 2 && gcm.collisionArray[tileIndex] !== 3
    )
  }
  generateRandomString(length) {
    let result = ""
    for (let i = 0; i < length; i++) {
      // Generate a random number between 0 and 9
      const randomNumber = _.random(0, 9)
      // Convert the number to a string and add it to the result
      result += randomNumber.toString()
    }
    return result
  }
  speedPerTick(entity: gEntity) {
    return entity.alive.speed * 10 * gpixi.deltaSec
  }
  deadZoneExceed(deadZone: number) {
    const axes: number[] = [gic.gamepad.axes[0], gic.gamepad.axes[1]]
    let moved = false

    axes.forEach((axis: number) => {
      if (Math.abs(axis) > deadZone) {
        moved = true
      }
    })
    return moved
  }

  /** @returns array of sorted keys of object by descendant order of its number values, for example {a: -1, b: 1, c: 2} became ["c", "b", "a"]" */
  sortedKeys(object) {
    return _.sortBy(_.keys(object), (key) => -object[key])
  }

  /**
   * Wrapper for pinia store that optionally accepts one or more watchers.
   * @param object - state object
   * @param args - watcher array that consist of a state property name and a handler function
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
  centerPoint() {
    return this.vector(960, 540)
  }
  mousePoint() {
    if (!gsd.states.firstMouseMove) return this.centerPoint()
    return glib.vector(
      gic.mouse.x / gsd.states.gameWindowScale,
      gic.mouse.y / gsd.states.gameWindowScale
    )
  }

  // coordinates
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
    return _.floor(coordinate / 100)
  }
  coordinateOffsetInTile(coordinate: number) {
    return coordinate % 100
  }
  tileIndexFromCoordinates(x: number, y: number) {
    return this.coordinateToTile(y) * 1000 + this.coordinateToTile(x)
  }
}

export const glib = new Lib()
