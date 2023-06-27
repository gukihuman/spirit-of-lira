export default {
  animation: "idle", // even for non-move
  firstFrames: { idle: 0, move: 0, attack: 0, death: 0 },
  fade: true, // death dissapear

  initial: {
    parent: "sortable", // direct stage container like "ground" or "sortable"
    randomFlip: true,
    randomFrame: true,
    loop: true,
  },

  flipMS: 0,
  animationMS: 0,

  // 🔧
  async init(entity, id, name, value) {
    if (!GPIXI.app) return

    const container = new PIXI.Container() as gContainer
    container.name = entity.name
    container.id = id
    GPIXI.entities.set(id, container)

    GPIXI[entity.visual.initial.parent].addChild(container)

    for (let name of ["back", "middle", "front", "effect"]) {
      const childContainer = new PIXI.Container()
      childContainer.name = name
      container.addChild(childContainer)
    }

    if (entity.visual.initial.randomFlip) {
      //
      // exclude effect
      const back = GPIXI.getBack(id)
      const middle = GPIXI.getMiddle(id)
      const front = GPIXI.getFront(id)
      if (!back || !middle || !front) return
      const containers = [back, middle, front]

      if (_.random() > 0.5) {
        containers.forEach((container) => {
          container.scale.x = -1
        })
      }
    }

    const spritesheet = await GPIXI.getSpritesheet(entity.name)
    if (!spritesheet) return

    const middle = GPIXI.getMiddle(id) as gContainer

    _.forOwn(spritesheet.animations, (arrayOfwebpImages, name) => {
      const sprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
      sprite.name = name
      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      sprite.animationSpeed = 1 / (CONFIG.fps / 10)
      sprite.visible = false
      sprite.cullable = true
      middle.addChild(sprite)

      // to prevent synchronize mobs, looks poor
      const randomFrame = _.random(0, sprite.totalFrames - 1)

      // loop is true by default
      if (!entity.visual.initial.loop || name === "death") sprite.loop = false

      if (entity.visual.initial.randomFrame) sprite.gotoAndPlay(randomFrame)
      else sprite.gotoAndPlay(0)
    })
  },
}
