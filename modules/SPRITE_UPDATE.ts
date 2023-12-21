const frames_to_validate = 3
const frames_to_validate_walk_run = 22
const walk_run_ratio = 0.8
class SpriteUpdate {
    init() {
        this.updateItems() // to load item sprites during loading
    }
    process() {
        WORLD.entities.forEach((ent, id) => {
            if (!ent.SPRITE || !ent.POS) return
            const container = SPRITE.getContainer(id)
            if (!container) return
            this.updateAnimation(ent, id)
            this.updateLastChangeMS(ent, id)
            this.updateCoordinates(ent, container)
            this.updateVisibility(ent, id)
            this.updateFirstFrameOfState(ent, id)
        })
        this.updateItems()
    }
    private updateFirstFrameOfState(ent, id) {
        if (ent.MOVE) {
            const lastEntity = WORLD.last.entities.get(id)
            if (!lastEntity) return
            SPRITE.getLayer(id, "animation")?.children.forEach((animation) => {
                if (
                    ent.SPRITE.active === animation.name &&
                    lastEntity.SPRITE.active !== animation.name
                ) {
                    const frame = ent.SPRITE.startFrames[animation.name]
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
    private updateCoordinates(ent, container) {
        container.x = ent.POS.x - HERO.ent.POS.x + CONFIG.viewport.width / 2
        container.y = ent.POS.y - HERO.ent.POS.y + CONFIG.viewport.height / 2
    }
    private updateVisibility(ent, id) {
        if (ent.MOVE) {
            SPRITE.getLayer(id, "animation")?.children.forEach((child) => {
                if (child.name === ent.SPRITE.active) child.visible = true
                else child.visible = false
            })
        } else {
            const animation = SPRITE.getLayer(id, "animation")
            if (animation && animation.children[0]) {
                animation.children[0].visible = true
            }
        }
    }
    getHeroCastSprite(ent, id) {
        // 📜 add sprite handling for other skills than attack
        // now weapon sprite option controls cast sprite
        // but it should be skill first by adding offensive or nutral options
        if (ent.HERO) {
            // "attack-sword"
            return ITEMS.collection.weapons[INVENTORY.gear.weapon].sprite
        } else {
            // "attack-sword"
            return ent.SKILLS.active
        }
    }
    private updateItems() {
        const heroSpriteName = this.getHeroCastSprite(HERO.ent, HERO.id)
        const heroAnimation = SPRITE.getAnimation(HERO.id, heroSpriteName)
        const frontWeapon = SPRITE.getLayer(HERO.id, "frontWeapon")
        const backWeapon = SPRITE.getLayer(HERO.id, "backWeapon")
        if (!heroAnimation || !frontWeapon || !backWeapon) return
        // syncronize all weapon sprites in cast state
        // turn visibility on for cast and off for non-attack
        // 📜 check if skill is neutral to not update and leave weapon idle
        if (HERO.ent.SPRITE.active === heroSpriteName) {
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
    private updateAnimation(ent, id) {
        if (!ent.STATE) return

        if (
            ent.SPRITE.leaveAnimationConditions &&
            ent.STATE.active !== "cast"
        ) {
            if (
                ent.SPRITE.active === "move" &&
                !ent.SPRITE.leaveAnimationConditions.move(ent, id)
            )
                return
        }

        if (ent.STATE.active === "dead") {
            ent.SPRITE.active = "dead"
            return
        }

        this.checkMove(ent, id)
        this.checkCast(ent, id)
    }
    private checkMove(ent, id) {
        if (!ent.MOVE || ent.STATE.active === "cast") return

        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return

        const distance = COORD.distance(ent.POS, lastEntity.POS)
        const speedPerTick = COORD.speedPerTick(ent)
        const distance_to_des = COORD.distance(ent.POS, ent.MOVE.final_des)

        if (distance / speedPerTick < 0.1) {
            this.setWithValidation(ent, id, "idle")
            return
        }
        if (SPRITE.getAnimation(id, "walk")) {
            if (ent.SPRITE.active === "walk" || ent.SPRITE.active === "run") {
                if (distance / speedPerTick < walk_run_ratio) {
                    this.setWalkRunWithValidation(ent, id, "walk")
                    return
                } else {
                    this.setWalkRunWithValidation(ent, id, "run")
                    return
                }
            } else if (ent.SPRITE.active === "idle") {
                if (
                    distance_to_des <
                    MOVE.max_speed_distance * walk_run_ratio
                ) {
                    this.setWithValidation(ent, id, "walk")
                    return
                } else {
                    this.setWithValidation(ent, id, "run")
                    return
                }
            } else {
                if (distance / speedPerTick < walk_run_ratio) {
                    this.setWithValidation(ent, id, "walk")
                    return
                } else {
                    this.setWithValidation(ent, id, "run")
                    return
                }
            }
        } else {
            this.setWithValidation(ent, id, "move")
            return
        }
    }
    private checkCast(ent, id) {
        if (!ent.MOVE || !ent.SKILLS) return
        if (ent.STATE.active !== "cast") return
        if (ent.HERO) {
            ent.SPRITE.active = this.getHeroCastSprite(HERO.ent, HERO.id)
        } else {
            ent.SPRITE.active = "attack"
        }
    }
    /** sets sprite if enough frames are validated */
    private setWithValidation(ent, id, sprite: string) {
        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return
        ent.SPRITE.onValidation = sprite
        if (lastEntity.SPRITE.onValidation !== ent.SPRITE.onValidation) {
            ent.SPRITE.framesValidated = 0
            return
        }
        if (lastEntity.SPRITE.framesValidated >= frames_to_validate) {
            ent.SPRITE.active = sprite
            return
        }
        ent.SPRITE.framesValidated++
    }
    private setWalkRunWithValidation(ent, id, sprite: string) {
        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return
        ent.SPRITE.onValidation = sprite
        if (lastEntity.SPRITE.onValidation !== ent.SPRITE.onValidation) {
            ent.SPRITE.framesWalkRunValidated = 0
            return
        }
        if (
            lastEntity.SPRITE.framesWalkRunValidated >=
            frames_to_validate_walk_run
        ) {
            ent.SPRITE.active = sprite
            return
        }
        ent.SPRITE.framesWalkRunValidated++
    }
    private updateLastChangeMS(ent, id) {
        const lastEntity = WORLD.last.entities.get(id)
        if (!lastEntity) return
        if (ent.SPRITE.active !== lastEntity.SPRITE.active) {
            WORLD.entities.get(id).SPRITE.lastChangeMS = LOOP.elapsed
        }
    }
}
export const SPRITE_UPDATE = new SpriteUpdate()
