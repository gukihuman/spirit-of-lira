class EntityFactory {
  private nextId = 1

  async createEntity(name: string, components?: { [key: string]: any }) {
    if (!gcs.entities.has(name)) return
    const id = this.nextId
    this.nextId++

    // transform entity class to an entity map
    // inject components declared in model
    const entityClass = gcs.entities.get(name)
    const entityModel = new entityClass()
    const entity = new Map()
    _.forEach(entityModel, (value, name) => entity.set(name, value))

    // inject components from argument
    _.forEach(components, (value, name) => entity.set(name, value))

    // inject default components
    entity.set("name", name)
    if (entity.has("visual")) await this.loadContainer(id, entity)
    if (entity.get("alive")) {
      entity.get("alive").state = "idle"
      entity.get("alive").targetEntity = undefined
      entity.get("alive").targetPosition = undefined
    }

    gworld.entities.set(id, entity)
    return id
  }

  private async loadContainer(id: number, entity: gEntity) {
    if (!gpixi.app) return
    const name = entity.get("name")
    const path = entity.get("visual").path

    const container = new PIXI.Container() as gContainer
    container.name = entity.get("name")
    container.id = id
    gpixi.sortable.addChild(container)

    for (let name of ["back", "animations", "front"]) {
      const childContainer = new PIXI.Container()
      childContainer.name = name
      container.addChild(childContainer)
    }

    let json: Record<string, undefined> | undefined = undefined

    // less console log warnings that asset is loaded again
    if (!PIXI.Assets.cache.has(name)) {
      json = await PIXI.Assets.load(path)
      PIXI.Assets.cache.set(name, json)
    } else {
      json = PIXI.Assets.cache.get(name)
    }
    if (!json) return

    const animationsContainer = gpixi.getAnimationContainer(id) as Container

    _.forOwn(json.animations, (arrayOfwebpImages, name) => {
      const animatedSprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
      animatedSprite.name = name
      animatedSprite.anchor.x = 0.5
      animatedSprite.anchor.y = 0.5
      animatedSprite.animationSpeed = 1 / 6
      animatedSprite.visible = false
      animationsContainer.addChild(animatedSprite)

      // to prevent synchronize mobs, looks poor
      const randomFrame = _.random(0, animatedSprite.totalFrames - 1)

      animatedSprite.gotoAndPlay(randomFrame)
    })
  }
}
export const gef = new EntityFactory()