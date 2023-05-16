import { NoScript } from "~~/.nuxt/components"

class EntityFactory {
  private nextId = 1

  async createEntity(name: string, components?: { [key: string]: any }) {
    if (!gs.entities.has(name)) return
    const id = this.nextId
    this.nextId++

    // transform entity class to an entity map
    // inject components declared in model
    const entityClass = gs.entities.get(name)
    const entityModel = new entityClass()
    const entity = new Map()

    // inject model components
    _.forEach(entityModel, (value, name) => entity.set(name, value))

    // inject components from argument
    _.forEach(components, (value, name) => entity.set(name, value))

    // inject / expand declared components
    entity.set("name", name)
    if (entity.has("visual")) {
      await this.loadContainer(id, entity)
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

  private async loadContainer(id: number, entity: gEntity) {
    if (!gpixi.app) return
    const name = entity.get("name")
    const path = entity.get("visual").path

    const container = new PIXI.Container() as gContainer
    container.name = entity.get("name")
    container.id = id
    container.scale.x = _.random() < 0.5 ? -1 : 1
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

    // let json = gs.jsons.get(name)
    // let json

    // // less console log warnings that asset is loaded again
    // if (!PIXI.Assets.cache.has(name)) {
    // json = await PIXI.Assets.load(path)
    //   // console.log(json)
    //   PIXI.Assets.cache.set(name, json)
    // } else {
    //   json = PIXI.Assets.cache.get(name)
    // }
    // if (!json) return
    // console.log("pixi", json)
    // console.log(name)
    // console.log(name, gs.jsons.get(name).meta)

    // console.log(name, gs.jsons.get(name))

    let texture

    if (!PIXI.Cache.has(name)) {
      texture = PIXI.Texture.from(gs.jsons.get(name).meta.image)
      PIXI.Cache.set(name, texture)
    } else {
      texture = PIXI.Cache.get(name)
    }

    console.log(gs.jsons.get(name).meta.image)

    let mySheet = new PIXI.Spritesheet(texture, gs.jsons.get(name))
    await mySheet.parse()
    // console.log("parsed", mySheet)

    // mySheet.parse(() => {
    //   const textures = mySheet.animations["animationName"];

    //   // Create an AnimatedSprite using the textures array
    //   const animatedSprite = new PIXI.AnimatedSprite(textures);
    //   // ...

    //   // Add the animatedSprite to your container or stage
    //   // ...
    // });

    const animationsContainer = gpixi.getAnimationContainer(id) as Container

    _.forOwn(mySheet.animations, (arrayOfwebpImages, name) => {
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
