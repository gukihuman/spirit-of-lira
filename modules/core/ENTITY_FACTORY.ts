class EntityFactory {
  private nextId = 1
  /**  @returns promise of entity id or undefined */
  async create(name: string, components?: { [key: string]: any }) {
    const entity = _.cloneDeep(MODELS.entities[name])
    if (!entity) {
      LIB.logWarning(`"${name}" not found (ENTITY_FACTORY)`)
      return
    }
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
    } else if (!entity.move) {
      await SPRITE.entity(entity, id, {
        randomFlip: false,
      })
    } else await SPRITE.entity(entity, id)
    return id
  }
  /** inject / expand components from components folder */
  private async injectComponents(entity: Entity, id: number) {
    // 📜 move sorting outside to calculate it only once
    const sortedPriority = LIB.sortedKeys(CONFIG.priority.componentInject)
    const promises: Promise<void>[] = []
    sortedPriority.forEach((name) => {
      const value = MODELS.components[name]
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
      LIB.logWarning(
        `"more than 100 loops of merging components, likely a circular dependency (ENTITY_FACTORY)`
      )
      return
    }
    // inject dependencies components before init
    if (value.depend) {
      const promises: Promise<void>[] = []
      value.depend.forEach((dependName) => {
        if (entity[dependName]) return
        const dependValue = MODELS.components[dependName]
        if (!dependValue) {
          LIB.logWarning(
            `"${dependName}" as a "${name}" dependency is not found (ENTITY_FACTORY)`
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
        const triggerValue = MODELS.components[triggerName]
        if (!triggerValue) {
          LIB.logWarning(
            `"${triggerName}" as a "${name}" trigger is not found (ENTITY_FACTORY)`
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
export const ENTITY_FACTORY = new EntityFactory()
