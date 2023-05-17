class ItemLoader {
  items = {
    // where items in front
    "common-sword": ["attack"],
  }

  async init() {
    if (!gpixi.app) return

    const promises: Promise<void>[] = []

    _.forEach(this.items, (states, name) => {
      promises.push(
        new Promise(async (resolve) => {
          console.log("eo")

          // make sprite sheet from stored json
          let texture
          if (!PIXI.Cache.has(name)) {
            texture = PIXI.Texture.from(gs.jsons.get(name).meta.image)
            PIXI.Cache.set(name, texture)
          } else {
            texture = PIXI.Cache.get(name)
          }
          let spriteSheet = new PIXI.Spritesheet(texture, gs.jsons.get(name))
          await spriteSheet.parse()

          const backItemContainer = new PIXI.Container() as gContainer
          backItemContainer.name = name
          const back = gpixi.getContainer(gsd.states.heroId)
            ?.children[0] as Container
          back.addChild(backItemContainer)

          const frontItemContainer = new PIXI.Container() as gContainer
          frontItemContainer.name = name
          const front = gpixi.getContainer(gsd.states.heroId)
            ?.children[2] as Container
          front.addChild(frontItemContainer)

          const currentState = gworld.entities
            .get(gsd.states.heroId)
            .get("alive").state
          const heroAnimationSprite = gpixi.getAnimationSprite(
            gsd.states.heroId,
            currentState
          )
          if (!heroAnimationSprite) return
          const currentFrame = heroAnimationSprite.currentFrame

          _.forOwn(spriteSheet.animations, (arrayOfwebpImages, stateName) => {
            const animatedSprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
            animatedSprite.name = stateName
            animatedSprite.anchor.x = 0.5
            animatedSprite.anchor.y = 0.5
            animatedSprite.animationSpeed = 1 / 6
            if (stateName === currentState) {
              animatedSprite.visible = true
            } else {
              animatedSprite.visible = false
            }
            animatedSprite.cullable = true
            animatedSprite.gotoAndPlay(currentFrame)

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
  }
}
export const gil = new ItemLoader()
