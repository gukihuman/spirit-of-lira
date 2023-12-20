class SpriteUpdate {
    private framesToValidate = 3
    private walkRunRatio = 0.9
    init() {
        this.updateItems() // to load item sprites during loading
    }
    process() {
        WORLD.entities.forEach((entity, id) => {
            if (!entity.SPRITE || !entity.POS) return
            const container = SPRITE.getContainer(id)
            if (!container) return
            this.updateAnimation(entity, id)
            this.updateLastChangeMS(entity, id)
            this.updateCoordinates(entity, container)
            this.updateVisibility(entity, id)
            this.updateFirstFrameOfState(entity, id)
        })
        this.updateItems()
    }
    private updateFirstFrameOfState(entity, id) {
        if (entity.MOVE) {
            const lastEntity = WORLD.last.entities.get(id)
            if (!lastEntity) return
            SPRITE.getLayer(id, "animation")?.children.forEach((animation) => {
                if (
                    entity.SPRITE.active === animation.name &&
                    lastEntity.SPRITE.active !== animation.name
                ) {
                    const frame = entity.SPRITE.startFrames[animation.name]
                    if (frame) {
                        SPRITE.getAnimation(id, animation.name)?.gotoAndPlay(
                            frame
                        )
                    } else {
                        SPRITE.getAnimation(id, animation.name)?.gotoAndPlay(0)
                    }
                }
            })
        }
    }
    private updateCoordinates(entity, container) {
        container.x =
            entity.POS.x - HERO.entity.POS.x + CONFIG.viewport.width / 2
        container.y =
            entity.POS.y - HERO.entity.POS.y + CONFIG.viewport.height / 2
    }
    private updateVisibility(entity, id) {
        if (entity.MOVE) {
            SPRITE.getLayer(id, "animation")?.children.forEach((child) => {
                if (child.name === entity.SPRITE.active) child.visible = true
                else child.visible = false
            })
        } else {
            const animation = SPRITE.getLayer(id, "animation")
            if (animation && animation.children[0]) {
                animation.children[0].visible = true
            }
        }
    }
    getHeroCastSprite(entity, id) {
        // 📜 add sprite handling for other skills than attack
        // now weapon sprite option controls cast sprite
        // but it should be skill first by adding offensive or nutral options
        if (entity.HERO) {
            // "attack-sword"
            return ITEMS.collection.weapons[INVENTORY.gear.weapon].sprite
        } else {
            // "attack-sword"
            return entity.SKILLS.active
        }
    }
    private updateItems() {
        const heroSpriteName = this.getHeroCastSprite(HERO.entity, HERO.id)
        const heroAnimation = SPRITE.getAnimation(HERO.id, heroSpriteName)
        const frontWeapon = SPRITE.getLayer(HERO.id, "frontWeapon")
        const backWeapon = SPRITE.getLayer(HERO.id, "backWeapon")
        if (!heroAnimation || !frontWeapon || !backWeapon) return
        // syncronize all weapon sprites in cast state
        // turn visibility on for cast and off for non-attack
        // 📜 check if skill is neutral to not update and leave weapon idle
        if (HERO.entity.SPRITE.active === heroSpriteName) {
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
    private updateAnimation(entity, id) {
        if (!entity.STATE) return

        if (
            entity.SPRITE.leaveAnimationConditions &&
            entity.STATE.active !== "cast"
        ) {
            if (
                entity.SPRITE.active === "move" &&
                !entity.SPRITE.leaveAnimationConditions.move(entity, id)
            )
                return
        }

        if (entity.STATE.active === "dead") {
            entity.SPRITE.active = "dead"
            return
        }

        this.checkMove(entity, id)
        this.checkCast(entity, id)
    }
    private checkMove(entity, id) {
        if (!entity.MOVE || entity.STATE.active === "cast") return

        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return

        const distance = COORD.distance(entity.POS, lastEntity.POS)
        const speedPerTick = COORD.speedPerTick(entity)

        if (distance / speedPerTick < 0.1) {
            //
            this.setWithValidation(entity, id, "idle")
            return
        }
        if (SPRITE.getAnimation(id, "walk")) {
            //
            if (distance / speedPerTick < this.walkRunRatio) {
                //
                this.setWithValidation(entity, id, "walk")
                return
                //
            } else {
                //
                this.setWithValidation(entity, id, "run")
                return
            }
        } else {
            //
            this.setWithValidation(entity, id, "move")
            return
        }
    }
    private checkCast(entity, id) {
        if (!entity.MOVE || !entity.SKILLS) return
        if (entity.STATE.active !== "cast") return
        if (entity.HERO) {
            entity.SPRITE.active = this.getHeroCastSprite(HERO.entity, HERO.id)
        } else {
            entity.SPRITE.active = "attack"
        }
    }
    /** sets sprite if enough frames are validated */
    private setWithValidation(entity, id, sprite: string) {
        //
        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return

        entity.SPRITE.onValidation = sprite

        if (lastEntity.SPRITE.onValidation !== entity.SPRITE.onValidation) {
            entity.SPRITE.framesValidated = 0
            return
        }
        if (lastEntity.SPRITE.framesValidated >= this.framesToValidate) {
            //
            entity.SPRITE.active = sprite
            return
        }
        entity.SPRITE.framesValidated++
    }
    private updateLastChangeMS(entity, id) {
        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return
        if (entity.SPRITE.active !== lastEntity.SPRITE.active) {
            WORLD.entities.get(id).SPRITE.lastChangeMS = LOOP.elapsed
        }
    }
}
export const SPRITE_UPDATE = new SpriteUpdate()
