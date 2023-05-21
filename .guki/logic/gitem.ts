class Item {
  items = {
    // value is an array of states that goes in front
    "common-sword": ["attack"],
  }
  itemSprites: AnimatedSprite[] = []

  process() {
    const heroSprite = gpixi.getAnimationSprite(gg.heroId, gg.hero.alive.state)
    if (!heroSprite) return

    this.itemSprites.forEach((sprite) => {
      // instead of checking each state, just syncronize all item sprites
      // and mock up if the frame difference for shorter animations =)
      if (heroSprite.currentFrame > sprite.totalFrames - 1) return

      sprite.gotoAndPlay(heroSprite.currentFrame)
    })
  }

  async init() {
    if (!gpixi.app || !gg.heroId) return
    if (!gpixi.getContainer(gg.heroId)) return

    const promises: Promise<void>[] = []

    _.forEach(this.items, (states, name) => {
      promises.push(
        new Promise(async (resolve) => {
          const spritesheet = await gpixi.getSpritesheet(name)
          if (!spritesheet) return

          const backItemContainer = new PIXI.Container() as gContainer
          backItemContainer.name = name
          const back = gpixi.getContainer(gg.heroId)?.children[0] as Container
          back.addChild(backItemContainer)

          const frontItemContainer = new PIXI.Container() as gContainer
          frontItemContainer.name = name
          const front = gpixi.getContainer(gg.heroId)?.children[2] as Container
          front.addChild(frontItemContainer)

          _.forOwn(spritesheet.animations, (arrayOfwebpImages, stateName) => {
            const animatedSprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
            animatedSprite.name = stateName
            animatedSprite.anchor.x = 0.5
            animatedSprite.anchor.y = 0.5
            animatedSprite.animationSpeed = 1 / 6
            animatedSprite.visible = false
            animatedSprite.cullable = true
            animatedSprite.play()
            this.itemSprites.push(animatedSprite)

            // classify items on back or in front
            if (states.includes(stateName)) {
              frontItemContainer.addChild(animatedSprite)
            } else backItemContainer.addChild(animatedSprite)
          })

          resolve()
        })
      )
    })
    await Promise.all(promises)

    gpixi.tickerAdd(() => {
      this.process()
    }, "gitem")
  }
}
export const gitem = new Item()
