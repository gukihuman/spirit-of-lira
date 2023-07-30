//
class Spr {
  //
  async createEntitySprite(
    entity: AnyObject,
    id: number,
    options: AnyObject = {}
  ) {
    //
    const parent = options.parent ?? "sortable"
    const randomFlip = options.randomFlip ?? true
    const randomStartFrame = options.randomStartFrame ?? true
    const loop = options.loop ?? true
    const layers = options.layers ?? [
      "shadow",
      "backEffect",
      "main",
      "frontEffect",
    ]

    const container = new PIXI.Container()
    container.name = entity.name
    WORLD.entityContainers.set(id, container)

    WORLD[parent].addChild(container)

    for (let name of layers) {
      //
      const layer = new PIXI.Container()
      layer.name = name
      container.addChild(layer)
    }

    if (randomFlip) {
      //
      const main = WORLD.getLayer(id, "main")
      if (!main) return

      if (_.random() > 0.5) main.scale.x = -1
    }

    const spritesheet = await WORLD.getSpritesheet(entity.name)
    const main = WORLD.getLayer(id, "main")
    if (!main || !spritesheet) return

    _.forOwn(spritesheet.animations, (arrayOfwebpImages, name) => {
      const sprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
      sprite.name = name
      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      sprite.animationSpeed = 1 / (CONFIG.maxFPS / 10)
      sprite.visible = false
      sprite.cullable = true
      main.addChild(sprite)

      // prevent synchronized mobs
      const randomFrame = _.random(0, sprite.totalFrames - 1)

      // PIXI sprite loops by default, "else" is no needed
      if (!loop || name === "death") sprite.loop = false

      if (randomStartFrame) sprite.gotoAndPlay(randomFrame)
      else sprite.gotoAndPlay(0)
    })
  }
}
export const SPRITE = new Spr()
