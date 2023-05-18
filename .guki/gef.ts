class EntityFactory {
  private nextId = 1

  /** @returns promise of entity id or undefined */
  async createEntity(name: string, components?: { [key: string]: any }) {
    if (!gstorage.entities.has(name)) {
      glib.logWarning(`"${name}" not found (gef)`)
      return
    }
    const id = this.nextId
    this.nextId++

    // transform entity class to an entity map
    const entityClass = gstorage.entities.get(name)
    const entityModel = new entityClass()
    const entity = new Map()

    // inject model components
    _.forEach(entityModel, (value, name) => entity.set(name, value))

    // inject components from argument
    _.forEach(components, (value, name) => entity.set(name, value))

    // inject / expand declared components
    entity.set("name", name)
    if (entity.has("visual")) {
      this.loadContainer(entity, id)
      if (!entity.get("visual").firstFrames && entity.has("alive")) {
        entity.get("visual").firstFrames = { idle: 0, move: 0, attack: 0 }
      }
    }
    if (entity.has("alive")) {
      entity.get("alive").state = "idle"
      entity.get("alive").targetEntity = undefined
      entity.get("alive").targetPosition = undefined
      entity.get("alive").lastStateSwitchMS = 0
      entity.get("alive").lastFlipMS = 0
      entity.get("alive").lastTargetPosition = undefined
      this.drawShadow(entity, id)
    }

    // handle process
    // 📜think about garbage collection on removing entity
    // for now process can be used only on once declared entities
    if (entityModel.process) {
      gpixi.tickerAdd(() => {
        entityModel.process(entity, id)
      }, name)
    }

    gworld.entities.set(id, entity)
    return id
  }

  private drawShadow(entity: gEntity, id: number) {
    const shadow = new PIXI.Graphics()
    shadow.beginFill(0x000000)

    const size = entity.get("alive").size

    shadow.drawCircle(0, 0, size)
    shadow.endFill()
    shadow.scale = { x: 1, y: 0.5 }
    shadow.alpha = 0.08
    shadow.blendMode = PIXI.BLEND_MODES.MULTIPLY

    const blurFilter = new PIXI.filters.BlurFilter()
    blurFilter.blur = 10

    shadow.filters = [blurFilter]

    const container = gpixi.getContainer(id)
    if (!container) return
    const back = container.children[0] as Container
    back.addChild(shadow)
  }

  private async loadContainer(entity: gEntity, id: number) {
    if (!gpixi.app) return
    const name = entity.get("name")

    const container = new PIXI.Container() as gContainer
    container.name = entity.get("name")
    container.id = id
    container.scale.x = _.random() < 0.5 ? -1 : 1

    // if parent not declared on model, add to sortable
    // could be only direct stage child like "ground"
    if (entity.get("visual").parentContainer) {
      gpixi[entity.get("visual").parentContainer].addChild(container)
    } else {
      gpixi.sortable.addChild(container)
    }

    for (let name of ["back", "animations", "front"]) {
      const childContainer = new PIXI.Container()
      childContainer.name = name
      container.addChild(childContainer)
    }

    // make sprite sheet from stored json
    let texture
    if (!PIXI.Cache.has(name)) {
      texture = PIXI.Texture.from(gstorage.jsons.get(name).meta.image)
      PIXI.Cache.set(name, texture)
    } else {
      texture = PIXI.Cache.get(name)
    }
    let spriteSheet = new PIXI.Spritesheet(texture, gstorage.jsons.get(name))
    await spriteSheet.parse()

    const animationsContainer = gpixi.getAnimationContainer(id) as Container

    _.forOwn(spriteSheet.animations, (arrayOfwebpImages, name) => {
      const animatedSprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
      animatedSprite.name = name
      animatedSprite.anchor.x = 0.5
      animatedSprite.anchor.y = 0.5
      animatedSprite.animationSpeed = 1 / 6
      animatedSprite.visible = false
      animatedSprite.cullable = true
      animationsContainer.addChild(animatedSprite)

      // to prevent synchronize mobs, looks poor
      const randomFrame = _.random(0, animatedSprite.totalFrames - 1)

      animatedSprite.gotoAndPlay(randomFrame)
    })
  }
}
export const gef = new EntityFactory()
