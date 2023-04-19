import { Application, Container } from "pixi.js"

class pixiManager {
  private app: Application | undefined = undefined

  async initialize(viewport) {
    this.app = new PIXI.Application({ width: 1920, height: 1080 })
    viewport.appendChild(this.app.view)
    globalThis.__PIXI_APP__ = this.app

    for (let name of ["ground", "sortable", "air"]) {
      const container = new PIXI.Container()
      container.name = name
      this.app.stage.addChild(container)
    }
  }
  public async loadEntity(id: number, name: string, url: string) {
    //
    const sortable: Container | undefined =
      this.app?.stage.getChildByName("sortable")

    const entitiy = new PIXI.Container()
    // 📜 add unique option for unique entities
    entitiy.name = name + "-" + id

    for (let name of ["back", "mid", "front"]) {
      const childContainer: Container = new PIXI.Container()
      childContainer.name = name
      entitiy?.addChild(childContainer)
    }

    const mid: Container | undefined = sortable?.getChildByName("mid")

    // url to json file
    let json = await PIXI.Assets.load(url)

    // key is animation name, value is an array of webp images
    _.forOwn(json.animations, (value, key) => {
      const sprite = new PIXI.AnimatedSprite(value)
      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      sprite.animationSpeed = 1 / 10
      sprite.play()
      sprite.visible = false
      sprite.name = key
      mid?.addChild(sprite)
    })
  }
}
export const gpm = new pixiManager()
