import { Sprite } from "pixi.js"
import { Container } from "pixi.js"

class EntityFactory {
  //
  private nextId: number = 0

  // populated from entity files on project start
  public entityModels: Map<string, gUniqueEntityModel | gCommonEntityModel> =
    new Map()

  public entityInstances: Map<number, gEntityInstance> = new Map()

  // this property is just a link, it actually stored in entityInstances
  public heroInstance: gEntityInstance | undefined

  public async instanceEntity(name: string) {
    //
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
      //
      entityInstance.process()

      // has te be after custom process
      this.defaultProcess(entityInstance, entityContainer, animationsContainer)
    })

    // 📜 maybe add initialize function to the entityModel itself
    // for example to add some additional mapChunks to location

    this.nextId++
  }

  private defaultProcess(
    entityInstance: gEntityInstance,
    entityContainer: gContainer,
    animationsContainer: Container
  ) {
    //
    // update container coordinates
    if (this.heroInstance) {
      entityContainer.x = entityInstance.x - this.heroInstance.x + 960
      entityContainer.y = entityInstance.y - this.heroInstance.y + 540
    }

    // update visibility of animations by entity state
    animationsContainer.children.forEach((child) => {
      if (!(child instanceof Sprite)) return

      if (child.name === entityInstance.state) child.visible = true
      else child.visible = false
    })

    // 📜 improve readability of this function
    // set animation frame between states if rules are provided in model
    if (entityInstance.howToSwitchAnimations) {
      //
      const lastEntityInstance = gcache.lastTick.entityInstances.get(
        entityInstance.id
      )
      if (!lastEntityInstance) return
      //
      _.forEach(
        entityInstance.howToSwitchAnimations,
        //
        (
          outerValue: number | { [index: string]: number | string },
          toState: string
        ) => {
          //
          // first state frame from any other state
          if (typeof outerValue === "number") {
            if (
              entityInstance.state === toState &&
              lastEntityInstance.state !== toState
            ) {
              gpm
                .getAnimationSprite(entityInstance.id, toState)
                .gotoAndPlay(outerValue)
            }
          } else {
            // first state frame from a particular other state
            // value is either a number or "smooth", key is a state
            _.forEach(
              outerValue,
              (innerValue: number | string, fromState: string) => {
                if (
                  entityInstance.state === toState &&
                  lastEntityInstance.state === fromState
                ) {
                  if (innerValue === "smooth") {
                    let fromAnimatedSprite = gpm.getAnimationSprite(
                      entityInstance.id,
                      fromState
                    )
                    let currentFrame = fromAnimatedSprite.currentFrame

                    // increment to the next frame
                    currentFrame++

                    // +1 here is just to fit the same frame because index started from 0
                    if (currentFrame + 1 > fromAnimatedSprite.totalFrames)
                      currentFrame = 0

                    gpm
                      .getAnimationSprite(entityInstance.id, toState)
                      .gotoAndPlay(currentFrame)
                  } else if (typeof innerValue === "number") {
                    gpm
                      .getAnimationSprite(entityInstance.id, toState)
                      .gotoAndPlay(innerValue)
                  }
                }
              }
            )
          }
        }
      )
    }
  }

  private randomCoordinatesFromMapChunks(mapChunks: string[]) {
    const randomChunk = _.sample(mapChunks)
    if (!randomChunk) return { x: 0, y: 0 }

    let x = glib.mapChunkToCoordinateX(randomChunk)
    let y = glib.mapChunkToCoordinateY(randomChunk)
    x += _.random(0, 999)
    y += _.random(0, 999)

    const tileIndex = glib.tileIndexFromCoordinates(x, y)
    if (gce.collisionArray[tileIndex] === 0) {
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
      animatedSprite.play()
      animatedSprite.visible = false
      animationsContainer.addChild(animatedSprite)
    })

    gpm.sortable.addChild(entityContainer)
  }
}
export const gef = new EntityFactory()
