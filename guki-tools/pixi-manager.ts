import { Application, Container, DisplayObject } from "pixi.js"

class pixiManager {
  public app: Application | undefined = undefined
  public ground = new PIXI.Container()
  public sortable = new PIXI.Container()
  public air = new PIXI.Container()

  public async initialize(viewport) {
    this.app = new PIXI.Application({ width: 1920, height: 1080 })
    viewport.appendChild(this.app.view)
    globalThis.__PIXI_APP__ = this.app

    this.app.stage.addChild(this.ground, this.sortable, this.air)
    this.ground.name = "ground"
    this.sortable.name = "sortable"
    this.air.name = "air"
  }
  public findEntityContainer(id: number) {
    for (let child of this.sortable.children) {
      const gContainer = child as gContainer
      if (gContainer.id === id) return child as gContainer
    }
    return undefined
  }
  public findAnimationCantainer(id: number, state: string) {
    const entityContainer = this.findEntityContainer(id)
    if (entityContainer) {
      const animationsContainer: Container =
        entityContainer.getChildByName("animations")
      return animationsContainer.getChildByName(state)
    }
    return undefined
  }
  public async loadEntityContainer(id: number, entity: gEntity) {
    if (!this.app) return

    const entityContainer = new PIXI.Container() as gContainer
    entityContainer.name = entity.name
    entityContainer.id = id
    this.sortable.addChild(entityContainer)

    for (let name of ["back", "animations", "front"]) {
      const childContainer = new PIXI.Container()
      childContainer.name = name
      entityContainer.addChild(childContainer)
    }
    // url to json file
    let json = await PIXI.Assets.load(entity.sprite)

    // key is animation name, value is an array of webp images
    _.forOwn(json.animations, (value, key) => {
      const animatedSprite = new PIXI.AnimatedSprite(value)
      animatedSprite.name = key
      animatedSprite.anchor.x = 0.5
      animatedSprite.anchor.y = 0.5
      animatedSprite.animationSpeed = 1 / 6
      animatedSprite.play()
      animatedSprite.visible = false
      const animationsContainer: Container =
        entityContainer.getChildByName("animations")
      animationsContainer.addChild(animatedSprite)
    })

    return entityContainer
  }
}
export const gpm = new pixiManager()
