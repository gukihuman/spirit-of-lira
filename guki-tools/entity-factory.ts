import { Sprite } from "pixi.js"
import { Container } from "pixi.js"

class EntityFactory {
  private nextId: number = 0

  // populated from entity files on project start
  public entityModels: Map<string, gUniqueEntityModel | gCommonEntityModel> =
    new Map()

  public entityInstances: Map<number, gEntityInstance> = new Map()

  // this property is just a link, it actually stored in entityInstances
  public heroInstance: gEntityInstance | undefined = undefined

  public async instanceEntity(name: string) {
    const entityModel = this.entityModels.get(name)
    if (!entityModel) return

    let entityInstance: gEntityInstance

    // construct entity instance depending on model type
    if (gtm.gUniqueEntity(entityModel)) {
      entityInstance = {
        ...entityModel,
        id: this.nextId,
        state: "idle",
        // x and y already exist in gUniqueEntity
      }
    } else {
      // gCommonEntity
      const { x, y } = this.randomCoordinatesFromMapChunks(
        entityModel.mapChunks
      )

      entityInstance = {
        ...entityModel,
        id: this.nextId,
        state: "idle",
        x,
        y,
      }

      delete entityInstance.mapChunks
    }

    await this.loadEntityContainer(this.nextId, entityInstance)
    const entityContainer = gpm.getEntityContainer(entityInstance.id)
    const animationsContainer = gpm.getAnimationsContainer(entityInstance.id)
    if (!entityContainer || !animationsContainer) return

    // one time heroInstance assignment
    if (!this.heroInstance && entityInstance.name === "hero") {
      this.heroInstance = entityInstance
    }

    this.entityInstances.set(entityInstance.id, entityInstance)

    gpm.app?.ticker.add(() => {
      entityInstance.process()

      // has te be after custom process
      this.defaultProcess(entityInstance, entityContainer, animationsContainer)
    })

    // 📜 maybe add initialize function state the entityModel itself
    // for example state add some additional mapChunks state location

    this.nextId++
  }

  private defaultProcess(
    entityInstance: gEntityInstance,
    entityContainer: gContainer,
    animationsContainer: Container
  ) {
    //
    // update container coordinates
    if (!this.heroInstance) return
    entityContainer.x = entityInstance.x - this.heroInstance.x + 960
    entityContainer.y = entityInstance.y - this.heroInstance.y + 540

    // update visibility of animations by entity state
    animationsContainer.children.forEach((child) => {
      if (!(child instanceof Sprite)) return
      if (child.name === entityInstance.state) child.visible = true
      else child.visible = false
    })

    // update animation frame on first animation tick
    if (!entityInstance.firstAnimationFrames) return
    const lastEntityInstance = gcache.lastTick.entityInstances.get(
      entityInstance.id
    )
    if (!lastEntityInstance) return
    _.forEach(
      entityInstance.firstAnimationFrames,
      (frame: number, state: string) => {
        if (
          entityInstance.state === state &&
          lastEntityInstance.state !== state
        ) {
          gpm.getAnimationSprite(entityInstance.id, state).gotoAndPlay(frame)
        }
      }
    )
  }

  private randomCoordinatesFromMapChunks(mapChunks: string[]) {
    const randomChunk = _.sample(mapChunks)
    if (!randomChunk) return { x: 0, y: 0 }

    let x = glib.mapChunkToCoordinateX(randomChunk)
    let y = glib.mapChunkToCoordinateY(randomChunk)
    x += _.random(0, 999)
    y += _.random(0, 999)

    const tileIndex = glib.tileIndexFromCoordinates(x, y)
    if (gcm.collisionArray[tileIndex] === 0) {
      return { x, y }
    } else {
      return this.randomCoordinatesFromMapChunks(mapChunks)
    }
  }

  private async loadEntityContainer(id: number, entityModel: gEntityInstance) {
    if (!gpm.app) return

    const entityContainer = new PIXI.Container() as gContainer
    entityContainer.name = entityModel.name
    entityContainer.id = id

    for (let name of ["back", "animations", "front"]) {
      const childContainer = new PIXI.Container()
      childContainer.name = name
      entityContainer.addChild(childContainer)
    }

    const animationsContainer: Container =
      entityContainer.getChildByName("animations")

    let json: Record<string, undefined> | undefined = undefined

    if (!PIXI.Assets.cache.has(entityModel.name)) {
      json = await PIXI.Assets.load(entityModel.sprite)
      PIXI.Assets.cache.set(entityModel.name, json)
    } else {
      json = PIXI.Assets.cache.get(entityModel.name)
    }
    if (!json) return

    // key is animation name, value is an array of webp images
    _.forOwn(json.animations, (value, key) => {
      const animatedSprite = new PIXI.AnimatedSprite(value)
      animatedSprite.name = key
      animatedSprite.anchor.x = 0.5
      animatedSprite.anchor.y = 0.5
      animatedSprite.animationSpeed = 1 / 6
      animatedSprite.visible = false
      animationsContainer.addChild(animatedSprite)

      const randomFrame = _.random(0, animatedSprite.totalFrames - 1)
      animatedSprite.gotoAndPlay(randomFrame)
    })

    gpm.sortable.addChild(entityContainer)
  }
}
export const gef = new EntityFactory()
