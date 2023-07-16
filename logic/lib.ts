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
  addGetter(object: { [index: string]: any }, name: string, fn: () => any) {
    Object.defineProperty(object, name, {
      get: fn,
      enumerable: true,
      configurable: true,
    })
  }

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
  speedPerTick(entity: Entity) {
    return entity.move.speed * 10 * GPIXI.deltaSec
  }
  deadZoneExceed(deadZone: number) {
    const axes: number[] = [INPUT.gamepad.axes[0], INPUT.gamepad.axes[1]]
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
   * Wrapper for pinia IMPORTS that optionally accepts one or more watchers.
   * @param object - state object
   * @param args - watcher array that consist of a state property name and a handler function
   * @returns a pinia IMPORTS with watchers and random name
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

  /**
   * This function takes spritesheet instance created by PIXI.Spritesheet and adds alternative "gParse" function to it. "gParse" removes caching from default "parse" function. This caching is binded to texture name like "idle.png" which is used repeatedly in this project by different entities. That causes lags. Cache is handled separatly with binding to entity name.
   * @param spritesheet - instance of PIXI.Spritesheet
   */
  addParseWithoutCaching(spritesheet: gSpritesheet) {
    const BATCH_SIZE = 1e3

    spritesheet.gProcessFrames = function (initialFrameIndex) {
      let frameIndex = initialFrameIndex
      const maxFrames = BATCH_SIZE
      while (
        frameIndex - initialFrameIndex < maxFrames &&
        frameIndex < this._frameKeys.length
      ) {
        const i = this._frameKeys[frameIndex]
        const data = this._frames[i]
        const rect = data.frame
        if (rect) {
          let frame: Rectangle | undefined = undefined
          let trim: Rectangle | undefined = undefined
          const sourceSize =
            data.trimmed !== false && data.sourceSize
              ? data.sourceSize
              : data.frame
          const orig = new PIXI.Rectangle(
            0,
            0,
            Math.floor(sourceSize.w) / this.resolution,
            Math.floor(sourceSize.h) / this.resolution
          )
          if (data.rotated) {
            frame = new PIXI.Rectangle(
              Math.floor(rect.x) / this.resolution,
              Math.floor(rect.y) / this.resolution,
              Math.floor(rect.h) / this.resolution,
              Math.floor(rect.w) / this.resolution
            )
          } else {
            frame = new PIXI.Rectangle(
              Math.floor(rect.x) / this.resolution,
              Math.floor(rect.y) / this.resolution,
              Math.floor(rect.w) / this.resolution,
              Math.floor(rect.h) / this.resolution
            )
          }
          if (data.trimmed !== false && data.spriteSourceSize) {
            trim = new PIXI.Rectangle(
              Math.floor(data.spriteSourceSize.x) / this.resolution,
              Math.floor(data.spriteSourceSize.y) / this.resolution,
              Math.floor(rect.w) / this.resolution,
              Math.floor(rect.h) / this.resolution
            )
          }
          this.textures[i] = new PIXI.Texture(
            this.baseTexture,
            frame,
            orig,
            trim,
            data.rotated ? 2 : 0,
            data.anchor
          )
          // this is the line that was turned off:
          // Texture.addToCache(this.textures[i], i)
        }
        frameIndex++
      }
    }

    spritesheet.gParse = function () {
      return new Promise((resolve) => {
        this._callback = resolve
        this._batchIndex = 0
        if (this._frameKeys.length <= BATCH_SIZE) {
          //
          this.gProcessFrames(0) // changed to modified function
          this._processAnimations()
          this._parseComplete()
        } else {
          this._nextBatch()
        }
      })
    }
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
    if (!SYSTEM_DATA.states.firstMouseMove) return this.centerPoint()
    return LIB.vector(
      INPUT.mouse.x / SYSTEM_DATA.states.gameWindowScale,
      INPUT.mouse.y / SYSTEM_DATA.states.gameWindowScale
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
    return _.floor(coordinate / 20)
  }
  coordinateOffsetInTile(coordinate: number) {
    return coordinate % 20
  }

  isWalkable(x: number, y: number) {
    let tileX = LIB.coordinateToTile(x)
    let tileY = LIB.coordinateToTile(y)
    return (
      SYSTEMS.collision.collisionArray[tileY][tileX] !== 2 &&
      SYSTEMS.collision.collisionArray[tileY][tileX] !== 3
    )
  }
}

export const LIB = new Lib()
