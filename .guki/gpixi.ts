import { Application, Container, AnimatedSprite } from "pixi.js"

class PixiManager {
  public app: Application | undefined = undefined

  public ground = new PIXI.Container()
  public collision = new PIXI.Container()
  public sortable = new PIXI.Container()

  public get deltaMS() {
    return this.app?.ticker.deltaMS || 16.66
  }

  public init(viewport) {
    //
    this.app = new PIXI.Application({ width: 1920, height: 1080 })
    viewport.appendChild(this.app.view)
    globalThis.__PIXI_APP__ = this.app

    for (let name of ["ground", "collision", "sortable"]) {
      this[name].name = name
      this.app.stage.addChild(this[name])
    }

    this.app.ticker.add(() => {
      this.sortable.children.sort((a, b) => a.y - b.y)
    })
  }

  public getEntityContainer(id: number) {
    for (let child of gpixi.sortable.children) {
      const gContainer = child as gContainer
      if (gContainer.id === id) return child as gContainer
    }
    return undefined
  }

  public getAnimationsContainer(id: number) {
    const entityContainer = this.getEntityContainer(id)
    return entityContainer?.getChildByName("animations") as Container
  }

  public getAnimationSprite(id: number, state: string) {
    const animationsContainer = this.getAnimationsContainer(id) as Container
    return animationsContainer.getChildByName(state) as AnimatedSprite
  }
}

export const gpixi = new PixiManager()
