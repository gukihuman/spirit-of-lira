export default {
  visual: {
    animation: "idle", // even for non-move
    firstFrames: { idle: 0, move: 0, attack: 0 },

    lastAnimationSwitchMS: 0,
    stableFlip: false,

    parentContainer: "sortable",

    // 🔧
    async init(entity, id, name, value) {
      if (!GPIXI.app) return

      const container = new PIXI.Container() as gContainer
      container.name = entity.name
      container.id = id
      GPIXI.entities.set(id, container)

      if (!entity.visual.stableFlip) {
        container.scale.x = _.random() < 0.5 ? -1 : 1
      }

      GPIXI[entity.visual.parentContainer].addChild(container)

      for (let name of ["back", "animations", "front"]) {
        const childContainer = new PIXI.Container()
        childContainer.name = name
        container.addChild(childContainer)
      }

      const spritesheet = await GPIXI.getSpritesheet(entity.name)
      if (!spritesheet) return

      const animationsContainer = GPIXI.getAnimation(id) as Container

      _.forOwn(spritesheet.animations, (arrayOfwebpImages, name) => {
        const sprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
        sprite.name = name
        sprite.anchor.x = 0.5
        sprite.anchor.y = 0.5
        sprite.animationSpeed = 1 / 6
        sprite.visible = false
        sprite.cullable = true
        animationsContainer.addChild(sprite)

        // to prevent synchronize mobs, looks poor
        const randomFrame = _.random(0, sprite.totalFrames - 1)

        if (name === "death") sprite.loop = false

        sprite.gotoAndPlay(randomFrame)
      })
    },
  },
}
