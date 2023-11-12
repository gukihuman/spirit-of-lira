class Creator {
  private nextId = 1
  async createStatic(
    name: string,
    components?: { [key: string]: any },
    pool: AnyObject = ENTITIES_STATIC.collection
  ) {
    this.create(name, components, pool)
  }
  /**  @returns promise of entity id or undefined */
  async create(
    name: string,
    components?: { [key: string]: any },
    pool: AnyObject = ENTITIES.collection
  ) {
    const entity = _.cloneDeep(pool[name])
    if (!entity) {
      LIBRARY.logWarning(`"${name}" not found (CREATOR)`)
      return
    }
    entity.name = name
    const id = this.nextId
    this.nextId++
    // inject / expand components from argument
    _.forEach(components, (value, name) => (entity[name] = _.cloneDeep(value)))
    // inject / expand components from components folder
    await this.injectComponents(entity, id)
    WORLD.entities.set(id, entity)
    if (name === "lira") {
      await SPRITE.entity(entity, id, {
        randomFlip: false,
        layers: [
          "shadow",
          "backEffect",
          "backWeapon",
          "animation",
          "cloth",
          "frontWeapon",
          "frontEffect",
        ],
      })
    } else if (entity.name.includes("cursor")) {
      await SPRITE.staticEntity(entity, id, {
        randomFlip: false,
        parent: "top",
      })
    } else if (!entity.MOVE) {
      if (ASSETS.jsons[name]) {
        await SPRITE.entity(entity, id, { randomFlip: false })
      } else {
        await SPRITE.staticEntity(entity, id, { randomFlip: false })
      }
    } else await SPRITE.entity(entity, id)
    return id
  }
  /** inject / expand components from components folder */
  private async injectComponents(entity, id: number) {
    // 📜 move sorting outside to calculate it only once
    const sortedPriority = LIBRARY.sortedKeys(CONFIG.priority.componentInject)
    const promises: Promise<void>[] = []
    sortedPriority.forEach((name) => {
      const value = globalThis[name].component
      if (!value) return
      // entity model has this component or component is auto injected
      if (entity[name] || value.autoInject) {
        this.dependCounter = 0
        promises.push(this.mergeComponent(entity, id, value, name))
      }
    })
    await Promise.all(promises)
  }
  private dependCounter = 0
  private async mergeComponent(entity, id, value, name) {
    this.dependCounter++
    if (this.dependCounter > 100) {
      LIBRARY.logWarning(
        `"more than 100 loops of merging components, likely a circular dependency (CREATOR)`
      )
      return
    }
    // inject dependencies components before init
    if (value.depend) {
      const promises: Promise<void>[] = []
      value.depend.forEach((dependName) => {
        if (entity[dependName]) return
        const dependValue = globalThis[dependName].component
        if (!dependValue) {
          LIBRARY.logWarning(
            `"${dependName}" as a "${name}" dependency is not found (CREATOR)`
          )
          return
        }
        promises.push(this.mergeComponent(entity, id, dependValue, dependName))
      })
      await Promise.all(promises)
    }
    entity[name] = _.merge(_.cloneDeep(value), entity[name])
    if (entity[name].inject) await entity[name].inject(entity, id)
    // inject triggered components after init
    if (entity[name].trigger) {
      const promises: Promise<void>[] = []
      value.trigger.forEach((triggerName) => {
        if (entity[triggerName]) return
        const triggerValue = globalThis[triggerName].component
        if (!triggerValue) {
          LIBRARY.logWarning(
            `"${triggerName}" as a "${name}" trigger is not found (CREATOR)`
          )
          return
        }
        promises.push(
          this.mergeComponent(entity, id, triggerValue, triggerName)
        )
      })
      await Promise.all(promises)
    }
    delete entity[name].autoInject
    delete entity[name].depend
    delete entity[name].trigger
    delete entity[name].inject
  }
}
export const CREATOR = new Creator()
