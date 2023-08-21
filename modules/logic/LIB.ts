class Lib {
  addGetter(object: AnyObject, name: string, fn: () => any) {
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
  /** transform an object into reactive pinia store, ignores but saves init */
  store(object: AnyObject) {
    const functions = {}
    _.forEach(object, (value, key) => {
      if (typeof value === "function") {
        functions[key] = value
        delete object[key]
      }
    })
    const storeObject: AnyObject = {}
    storeObject.state = defineStore(this.generateRandomString(10), {
      state: () => object,
    })
    _.forEach(object, (value, key) => {
      Object.defineProperty(storeObject, key, {
        get: () => storeObject.state()[key],
        set: (value) => {
          storeObject.state()[key] = value
        },
      })
    })
    _.forEach(functions, (value, key) => {
      storeObject[key] = value
    })
    return storeObject
  }
  hero(id: number) {
    if (id === WORLD.heroId) return true
    return false
  }

  /**
   * This function takes spritesheet instance created by PIXI.Spritesheet and adds alternative "gParse" function to it. "gParse" removes caching from default "parse" function. This caching is binded to texture name like "idle.png" which is used repeatedly in this project by different entities. That causes lags. Cache in Spirit of Lira is handled separatly with binding to entity name.
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
  logIfHero(id: number, ...args) {
    if (id === WORLD.heroId) {
      console.log(...args)
    }
  }
}

export const LIB = new Lib()
