export default {
  visual: {
    animation: "idle", // even for non-alive
    firstFrames: { idle: 0, move: 0, attack: 0 },
    parentContainer: "sortable",

    lastAnimationSwitchMS: 0,
    stableFlip: false,

    async init(entity, id, name, value) {
      if (!PIXI_GUKI.app) return

      const container = new PIXI.Container() as gContainer
      container.name = entity.name
      container.id = id

      if (!entity.visual.stableFlip) {
        container.scale.x = _.random() < 0.5 ? -1 : 1
      }

      PIXI_GUKI[entity.visual.parentContainer].addChild(container)

      for (let name of ["back", "animations", "front"]) {
        const childContainer = new PIXI.Container()
        childContainer.name = name
        container.addChild(childContainer)
      }

      const spritesheet = await PIXI_GUKI.getSpritesheet(entity.name)
      if (!spritesheet) return

      const animationsContainer = PIXI_GUKI.getAnimationContainer(
        id
      ) as Container

      _.forOwn(spritesheet.animations, (arrayOfwebpImages, name) => {
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
    },
  },
}
