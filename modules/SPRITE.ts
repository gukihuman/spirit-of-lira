class Spr {
    component = {
        active: "", // corresponds to state names
        startFrames: {}, // { idle: 11, move: 5 } default is 0
        // how many frames meet conditions consecutively
        framesValidated: 0,
        framesWalkRunValidated: 0,
        onValidation: "idle",
        lastChangeMS: 0,
        lastFlipMS: 0,
        effectHeightRatio: 0.1,
        effectWidthRatio: 0.15, // became negative depending on source
    }
    entityContainers: Map<number, Container> = new Map()
    effectContainers: Map<number, Container> = new Map()
    async ent(ent: AnyObject, id: number, options: AnyObject = {}) {
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
        container.name = ent.name
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
        const spritesheet = await this.getSpritesheet(ent.name)
        const animation = this.getLayer(id, "animation")
        if (!animation || !spritesheet) return
        _.forOwn(spritesheet.animations, (arrayOfwebpImages, name) => {
            const sprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
            sprite.name = name
            sprite.anchor.x = 0.5
            sprite.anchor.y = 0.5
            sprite.animationSpeed = 1 / (CONFIG.max_fps / 10)
            sprite.cullable = true
            animation.addChild(sprite)
            // prevent synchronized mobs
            const randomFrame = _.random(0, sprite.totalFrames - 1)
            // PIXI sprite loops by default, "else" is no needed
            if (!loop || name === "dead") sprite.loop = false
            if (randomStartFrame) sprite.gotoAndPlay(randomFrame)
            else sprite.gotoAndPlay(0)
        })
    }
    async staticEntity(ent: AnyObject, id: number, options: AnyObject = {}) {
        const parent = options.parent ?? "sortable"
        const randomFlip = options.randomFlip ?? true
        const layers = options.layers ?? [
            "shadow",
            "backEffect",
            "animation",
            "frontEffect",
        ]
        const container = new PIXI.Container()
        container.name = ent.name
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
        const animation = this.getLayer(id, "animation")
        const webpImage = ASSETS.webp_paths[ent.name]
        if (!animation || !webpImage) return
        const texture = PIXI.Texture.from(webpImage)
        const sprite = new PIXI.Sprite(texture)
        sprite.name = ent.name
        sprite.anchor.x = 0.5
        sprite.anchor.y = 0.5
        sprite.cullable = true
        animation.addChild(sprite)
    }
    async effect(ent: AnyObject, name: string, targetEntity: AnyObject) {
        if (!ent.TARGET.id) return
        let parentLayerName, durationMS
        if (EFFECTS.front[name]) {
            parentLayerName = "frontEffect"
            durationMS = EFFECTS.front[name]
        } else {
            parentLayerName = "backEffect"
            durationMS = EFFECTS.back[name]
        }
        if (!durationMS) {
            LIBRARY.logWarning(`effect ${name} not found (SPRITE)`)
            return
        }
        const container = new PIXI.Container()
        const parentLayer = this.getLayer(ent.TARGET.id, parentLayerName)
        if (!parentLayer) return
        parentLayer.addChild(container)
        this.offsetEffectContainer(container, ent, targetEntity)
        const expireMS = _.round(LOOP.elapsed + durationMS)
        this.effectContainers.set(expireMS, container)
        const possibleSprites: string[] = []
        _.forEach(ASSETS.jsons, (json, key) => {
            if (key.includes(name)) possibleSprites.push(key)
        })
        const finalSpriteName = _.sample(possibleSprites)
        if (!finalSpriteName) return
        const spritesheet = await this.getSpritesheet(finalSpriteName)
        if (!spritesheet) return
        _.forOwn(spritesheet.animations, (arrayOfwebpImages, name) => {
            const sprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
            sprite.name = name
            sprite.anchor.x = 0.5
            sprite.anchor.y = 0.5
            sprite.animationSpeed = 1 / (CONFIG.max_fps / 10)
            sprite.cullable = true
            sprite.loop = false
            sprite.play()
            container.addChild(sprite)
        })
    }
    private offsetEffectContainer(container, ent, targetEntity) {
        let effectHeightRatio = targetEntity.SPRITE.effectHeightRatio
        let effectWidthRatio = targetEntity.SPRITE.effectWidthRatio
        container.position.x = -targetEntity.SIZE.width * effectWidthRatio
        if (targetEntity.POS.x < ent.POS.x) {
            container.position.x = -container.position.x
        }
        container.position.y = -targetEntity.SIZE.height * effectHeightRatio
        const angle = COORD.angle(ent.POS, targetEntity.POS)
        container.rotation = angle
    }

    async item(name: string, type: "weapon" | "cloth") {
        if (!WORLD.app || !HERO.id || !this.getContainer(HERO.id)) return
        const spritesheet = await this.getSpritesheet(name)
        if (!spritesheet) return
        let backWeapon
        let frontWeapon
        let cloth
        if (type === "cloth") {
            cloth = this.getLayer(HERO.id, "cloth")
        }
        if (type === "weapon") {
            backWeapon = this.getLayer(HERO.id, "backWeapon")
            frontWeapon = this.getLayer(HERO.id, "frontWeapon")
        }
        _.forOwn(spritesheet.animations, (arrayOfwebpImages, stateName) => {
            const animatedSprite = new PIXI.AnimatedSprite(arrayOfwebpImages)
            animatedSprite.name = stateName
            animatedSprite.anchor.x = 0.5
            animatedSprite.anchor.y = 0.5
            animatedSprite.animationSpeed = 1 / 6
            animatedSprite.cullable = true
            animatedSprite.play()
            if (type === "cloth") cloth.addChild(animatedSprite)
            if (type === "weapon") {
                //
                if (stateName.includes("attack"))
                    frontWeapon.addChild(animatedSprite)
                //
                else backWeapon.addChild(animatedSprite)
            }
        })
    }
    emptyWeaponLayers() {
        const backWeapon = this.getLayer(HERO.id, "backWeapon") as Container
        const frontWeapon = this.getLayer(HERO.id, "frontWeapon") as Container
        backWeapon.removeChildren()
        frontWeapon.removeChildren()
    }
    emptyClothLayer() {
        const cloth = this.getLayer(HERO.id, "cloth") as Container
        cloth.removeChildren()
    }
    fillWeaponLayers() {
        if (INVENTORY.gear.weapon) {
            SPRITE.item(INVENTORY.gear.weapon, "weapon")
        }
    }
    fillClothLayer() {
        if (INVENTORY.gear.cloth) {
            SPRITE.item(INVENTORY.gear.cloth, "cloth")
        }
    }
    getContainer(id: number | undefined): Container | undefined {
        if (!id) return
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
        if (!animation) return
        return animation.getChildByName(spriteName) as AnimatedSprite
    }
    async getSpritesheet(name: string): Promise<gSpritesheet | undefined> {
        let json = ASSETS.jsons[name]
        if (!json) {
            LIBRARY.logWarning(`no json for ${name} in ASSETS.jsons (SPRITE)`)
            return
        }
        // lazy guard for an ISpritesheetData type of json from Texture Packer
        if (!json.animations || !json.frames || !json.meta) return
        let texture
        let spritesheet
        if (!PIXI.Cache.has(name)) {
            if (!ASSETS.jsons[name]) return
            texture = PIXI.Texture.from(json.meta.image)
            spritesheet = new PIXI.Spritesheet(
                texture,
                json as ISpritesheetData
            )
            PIXI.Cache.set(name, [texture, spritesheet])
        } else {
            texture = PIXI.Cache.get(name)[0]
            spritesheet = PIXI.Cache.get(name)[1]
        }
        // adds gParse function as a non-cache alternative to parse
        LIBRARY.addParseWithoutCaching(spritesheet)
        await spritesheet.gParse()
        return spritesheet
    }
}
export const SPRITE = new Spr()
