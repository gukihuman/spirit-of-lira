import { g } from "vitest/dist/index-40ebba2b"

class EntityFactory {
  private nextId = 1

  /** @returns promise of entity id or undefined */
  async createEntity(name: string, components?: { [key: string]: any }) {
    //
    const entity = _.cloneDeep(gstorage.entities.get(name))
    if (!entity) {
      glib.logWarning(`"${name}" not found (gef)`)
      return
    }
    const id = this.nextId
    this.nextId++

    // inject / expand components from argument
    _.forEach(components, (value, name) => (entity[name] = _.cloneDeep(value)))

    // inject / expand components from components folder
    this.injectComponents(entity, id)

    gworld.entities.set(id, entity)
    return id
  }
  private injectComponents(entity: gEntity, id: number) {
    gstorage.components.forEach((value, name) => {
      //
      // special treatment
      if (name === "position" && entity.position !== false) {
        entity.position = _.merge(_.cloneDeep(value), entity.position)
        return
      }
      if (name === "visual" && entity.visual !== false) {
        if (!entity.visual) entity.visual = {}
        // if (entity.alive) {
        entity.visual = _.merge(_.cloneDeep(value), entity.visual)
        // }
        this.loadContainer(entity, id)
        return
      }
      if (name === "alive" && entity.alive) {
        entity.alive = _.merge(_.cloneDeep(value), entity.alive)
        this.drawShadow(entity, id)
        return
      }

      // default expand if exist
      if (entity[name]) entity[name] = _.merge(_.cloneDeep(value), entity[name])
    })
  }

  private drawShadow(entity: gEntity, id: number) {
    if (!entity.alive) {
      glib.logWarning(
        `drawShadow called on non-alive entity: "${entity.name}" (gef)`
      )
      return
    }

    const shadow = new PIXI.Graphics()
    shadow.beginFill(0x000000)

    const size = entity.alive.size

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

    const container = new PIXI.Container() as gContainer
    container.name = entity.name
    container.id = id
    container.scale.x = _.random() < 0.5 ? -1 : 1

    gpixi[entity.visual.parentContainer].addChild(container)

    for (let name of ["back", "animations", "front"]) {
      const childContainer = new PIXI.Container()
      childContainer.name = name
      container.addChild(childContainer)
    }

    // make sprite sheet from stored json
    let texture
    if (!PIXI.Cache.has(entity.name)) {
      texture = PIXI.Texture.from(gstorage.jsons.get(entity.name).meta.image)
      PIXI.Cache.set(entity.name, texture)
    } else {
      texture = PIXI.Cache.get(entity.name)
    }
    let spriteSheet = new PIXI.Spritesheet(
      texture,
      gstorage.jsons.get(entity.name)
    )
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
