export default class {
  items = {
    // value is an array of states that goes in front
    "common-sword": ["attack"],
  }
  itemSprites: AnimatedSprite[] = []

  process() {
    const heroSprite = SPRITE.getAnimation(
      WORLD.heroId,
      WORLD.hero.sprite.active
    )
    if (!heroSprite) return

    if (
      WORLD.hero.sprite.active.includes("attack") ||
      (!WORLD.hero.sprite.active.includes("attack") &&
        LAST_WORLD.hero.sprite.active.includes("attack"))
    ) {
      this.itemSprites.forEach((sprite) => {
        //
        // instead of checking each state, just syncronizes all item sprites
        // and mock up if the frame difference for shorter state animations =)
        if (heroSprite.currentFrame > sprite.totalFrames - 1) return

        sprite.gotoAndPlay(heroSprite.currentFrame)
      })
    }

    this.updateVisibilityByState()
  }

  // async init() {
  //   if (!WORLD.app || !WORLD.heroId) return
  //   if (!SPRITE.getContainer(WORLD.heroId)) return

  //   const promises: Promise<void>[] = []

  //   _.forEach(this.items, (frontStates, name) => {
  //     promises.push(
  //       new Promise(async (resolve) => {
  //         const spritesheet = await SPRITE.getSpritesheet(name)
  //         if (!spritesheet) return

  //         const backItemContainer = new PIXI.Container()
  //         backItemContainer.name = name
  //         const back = SPRITE.getContainer(WORLD.heroId)
  //           ?.children[0] as Container
  //         back.addChild(backItemContainer)

  //         const frontItemContainer = new PIXI.Container()
  //         frontItemContainer.name = name
  //         const front = SPRITE.getContainer(WORLD.heroId)
  //           ?.children[2] as Container
  //         front.addChild(frontItemContainer)

  //         _.forOwn(spritesheet.animations, (arrayOfwebpImages, stateName) => {
  //           const animatedSprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
  //           animatedSprite.name = stateName
  //           animatedSprite.anchor.x = 0.5
  //           animatedSprite.anchor.y = 0.5
  //           animatedSprite.animationSpeed = 1 / 6
  //           animatedSprite.visible = false
  //           animatedSprite.cullable = true
  //           animatedSprite.play()
  //           this.itemSprites.push(animatedSprite)

  //           // classify items on back or in front
  //           if (frontStates.includes(stateName)) {
  //             frontItemContainer.addChild(animatedSprite)
  //           } else backItemContainer.addChild(animatedSprite)
  //         })

  //         resolve()
  //       })
  //     )
  //   })
  //   await Promise.all(promises)
  // }
  private updateVisibilityByState() {
    const currentAnimation = WORLD.hero.sprite.active

    // 📜 move to class scope
    const back = SPRITE.getContainer(WORLD.heroId)?.children[0] as Container
    const front = SPRITE.getContainer(WORLD.heroId)?.children[2] as Container
    if (!back || !front) return

    back.children.forEach((child) => {
      const itemContainer = child as Container
      itemContainer.children.forEach((sprite) => {
        if (
          sprite.name === currentAnimation ||
          (sprite.name === "idle" && currentAnimation === "run") ||
          (sprite.name === "idle" && currentAnimation === "walk")
        ) {
          sprite.visible = true
        } else {
          sprite.visible = false
        }
      })
    })
  }
}
