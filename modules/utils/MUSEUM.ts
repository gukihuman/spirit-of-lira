// functions that is used by other modules that may conflict with LIBRARY order of usage creating circular dependencies, basically this is more foundational functions used more internally on app building not executing
class Museum {
  processEntity(
    components: string[] | string,
    fn: (entity, id: number) => void
  ) {
    WORLD.entities.forEach((entity, id) => {
      let satisfied = true
      if (typeof components === "string") {
        if (!entity[components]) satisfied = false
      } else {
        components.forEach((component) => {
          if (!entity[component]) satisfied = false
        })
      }
      if (satisfied) fn(entity, id)
    })
  }
  storeEcho(module: AnyObject) {
    if (module.echo) module.echo = this.store(module.echo)
    return module
  }
  /** transform an object into reactive pinia store, ignores but saves fns */
  private store(object: AnyObject) {
    const functions = {}
    _.forEach(object, (value, key) => {
      if (typeof value === "function") {
        functions[key] = value
        delete object[key]
      }
    })
    const storeObject: AnyObject = {}
    storeObject.state = defineStore(this.generateRandomString(), {
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
  generateRandomString(length = 10) {
    let result = ""
    for (let i = 0; i < length; i++) {
      const randomNumber = _.random(0, 9)
      result += randomNumber.toString()
    }
    return result
  }
}
export const MUSEUM = new Museum()
