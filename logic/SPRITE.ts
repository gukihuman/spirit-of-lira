//
class Spr {
  //
  init() {
    //
    EVENTS.on("entityCreated", (data) => {
      //
      if (data.entity.name === "lira") {
        //
        SPRITE.createEntitySprite(data.entity, data.id, {
          //
          randomFlip: false,
          layers: [
            "shadow",
            "backEffect",
            "backWeapon",
            "animation",
            "clothes",
            "frontWeapon",
            "frontEffect",
          ],
        })

        return
      }

      // static or npc
      if (!data.entity.move) {
        //
        SPRITE.createEntitySprite(data.entity, data.id, {
          //
          randomFlip: false,
        })

        return
      }

      SPRITE.createEntitySprite(data.entity, data.id)
    })
  }

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
      "animation",
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
      const animation = WORLD.getLayer(id, "animation")
      if (!animation) return

      if (_.random() > 0.5) animation.scale.x = -1
    }

    const spritesheet = await WORLD.getSpritesheet(entity.name)
    const animation = WORLD.getLayer(id, "animation")
    if (!animation || !spritesheet) return

    _.forOwn(spritesheet.animations, (arrayOfwebpImages, name) => {
      const sprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
      sprite.name = name
      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      sprite.animationSpeed = 1 / (CONFIG.maxFPS / 10)
      sprite.visible = false
      sprite.cullable = true
      animation.addChild(sprite)

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
