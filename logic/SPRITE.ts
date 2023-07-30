class Spr {
  entityContainers: Map<number, Container> = new Map()
  init() {
    WORLD.loop.add(() => {
      this.process()
    }, "SPRITE")
  }
  process() {
    const heroAnimation = this.getAnimation(
      WORLD.heroId,
      WORLD.hero.sprite.active
    )
    const frontWeapon = SPRITE.getLayer(WORLD.heroId, "frontWeapon")
    const backWeapon = SPRITE.getLayer(WORLD.heroId, "backWeapon")
    if (!heroAnimation || !frontWeapon || !backWeapon) return
    // syncronize all weapon sprites in attack state
    // turn visibility on for attack and off for non-attack
    if (WORLD.hero.sprite.active.includes("attack")) {
      frontWeapon.children.forEach((child) => {
        const sprite = child as AnimatedSprite
        sprite.gotoAndPlay(heroAnimation.currentFrame)
      })
      frontWeapon.visible = true
      backWeapon.visible = false
    } else {
      backWeapon.visible = true
      frontWeapon.visible = false
    }
  }
  async createEntitySprite(
    entity: AnyObject,
    id: number,
    options: AnyObject = {}
  ) {
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
    this.entityContainers.set(id, container)
    WORLD[parent].addChild(container)
    for (let name of layers) {
      const layer = new PIXI.Container()
      layer.name = name
      container.addChild(layer)
    }
    if (randomFlip) {
      const animation = this.getLayer(id, "animation")
      if (!animation) return
      if (_.random() > 0.5) animation.scale.x = -1
    }
    const spritesheet = await this.getSpritesheet(entity.name)
    const animation = this.getLayer(id, "animation")
    if (!animation || !spritesheet) return
    _.forOwn(spritesheet.animations, (arrayOfwebpImages, name) => {
      const sprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
      sprite.name = name
      sprite.anchor.x = 0.5
      sprite.anchor.y = 0.5
      sprite.animationSpeed = 1 / (CONFIG.maxFPS / 10)
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
  async createItemSprite(name: string, type: "weapon" | "cloth") {
    if (!WORLD.app || !WORLD.heroId || !this.getContainer(WORLD.heroId)) return
    const spritesheet = await this.getSpritesheet(name)
    if (!spritesheet) return
    let backWeapon
    let frontWeapon
    let cloth
    if (type === "cloth") {
      cloth = this.getLayer(WORLD.heroId, "cloth") as Container
    }
    if (type === "weapon") {
      backWeapon = this.getLayer(WORLD.heroId, "backWeapon") as Container
      frontWeapon = this.getLayer(WORLD.heroId, "frontWeapon") as Container
    }
    _.forOwn(spritesheet.animations, (arrayOfwebpImages, stateName) => {
      const animatedSprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
      animatedSprite.name = stateName
      animatedSprite.anchor.x = 0.5
      animatedSprite.anchor.y = 0.5
      animatedSprite.animationSpeed = 1 / 6
      animatedSprite.visible = true
      animatedSprite.cullable = true
      animatedSprite.play()
      if (type === "cloth") cloth.addChild(animatedSprite)
      if (type === "weapon") {
        //
        if (stateName.includes("attack")) frontWeapon.addChild(animatedSprite)
        //
        else backWeapon.addChild(animatedSprite)
      }
    })
  }
  emptyWeaponLayers() {
    const backWeapon = this.getLayer(WORLD.heroId, "backWeapon") as Container
    const frontWeapon = this.getLayer(WORLD.heroId, "frontWeapon") as Container
    backWeapon.removeChildren()
    frontWeapon.removeChildren()
  }
  emptyClothLayer() {
    const cloth = this.getLayer(WORLD.heroId, "cloth") as Container
    cloth.removeChildren()
  }
  getContainer(id: number): Container | undefined {
    return this.entityContainers.get(id)
  }
  getLayer(id: number, layer: string): Container | undefined {
    const entityContainer = this.getContainer(id)
    return entityContainer?.getChildByName(layer) as Container
  }
  getAnimation(
    id: number,
    spriteName: string = "idle"
  ): AnimatedSprite | undefined {
    const animation = this.getLayer(id, "animation") as Container
    return animation.getChildByName(spriteName) as AnimatedSprite
  }
  async getSpritesheet(name: string): Promise<gSpritesheet | undefined> {
    let json = ASSETS.jsons.get(name)
    if (!json) {
      LIB.logWarning(`no json for ${name} in ASSETS.jsons (SPRITE)`)
      return
    }
    // lazy guard for an ISpritesheetData type of json from Texture Packer
    if (!json.animations || !json.frames || !json.meta) return
    let texture
    let spritesheet
    if (!PIXI.Cache.has(name)) {
      if (!ASSETS.jsons.get(name)) return
      texture = PIXI.Texture.from(json.meta.image)
      spritesheet = new PIXI.Spritesheet(texture, json as ISpritesheetData)
      PIXI.Cache.set(name, [texture, spritesheet])
    } else {
      texture = PIXI.Cache.get(name)[0]
      spritesheet = PIXI.Cache.get(name)[1]
    }
    // adds gParse function as a non-cache alternative to parse
    LIB.addParseWithoutCaching(spritesheet)
    await spritesheet.gParse()
    return spritesheet
  }
}
export const SPRITE = new Spr()
