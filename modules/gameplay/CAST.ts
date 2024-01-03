const pre_cast_urge = 250
// no damage if target go away based on skill distance
class Cast {
    attackSoundTimeIds: any = []
    heroSwordAttackCastStage: 0 | 1 = 0 // animation stage
    private cast(slot = "slot1") {
        if (CONTEXT.echo.novel || CONTEXT.echo.interface) return
        EVENTS.emit("cast", {
            ent: HERO.ent,
            slot: slot,
        })
    }
    init() {
        EVENTS.onSingle("decide", () => {
            if (INTERFACE.buttonHover) return
            if (GLOBAL.hoverId) {
                if (GLOBAL.hoverId !== HERO.ent.TARGET.id) {
                    HERO.ent.TARGET.id = GLOBAL.hoverId
                    HERO.ent.STATE.idle = true
                    HERO.ent.STATE.cast = false
                    HERO.ent.STATE.active = "idle"
                }
                EVENTS.emitSingle("cast1")
                EVENTS.emitSingle("lockTarget")
            } else MOVE.mouseMove()
        })
        EVENTS.onSingle("cast1", () => this.cast("slot1"))
        EVENTS.onSingle("cast2", () => this.cast("slot2"))
        EVENTS.onSingle("cast3", () => this.cast("slot3"))
        EVENTS.onSingle("cast4", () => this.cast("slot4"))
        EVENTS.on("cast", ({ ent, slot }) => {
            if (!ent.TARGET.ent || ent.TARGET.ent.STATE.active === "dead") {
                return
            }
            ent.SKILLS.active = ent.SKILLS[slot]
            ent.STATE.track = true
            ent.TARGET.locked = true // important even for hero :)
            ent.TARGET.attackedId = ent.TARGET.id
        })
    }
    private targetDiesLogic(ent, id) {
        ent.TARGET.id = undefined
        ent.TARGET.locked = false
        ent.MOVE.final_des = _.cloneDeep(ent.POS)
        if (ent.HERO) {
            if (!SETTINGS.echo.general.autoAttackNext) {
                ent.STATE.track = false
            } else {
                TIME.next(() => {
                    // its new target by autoAttackNext here
                    ent.TARGET.locked = true
                })
            }
            MOVE.lastMobKilledMS = LOOP.elapsed // prevent gamepad move on delay
        }
    }
    private revengeLogic(ent, id, skill) {
        EVENTS.emit("revenge", {
            ent: ent.TARGET.ent,
            id: ent.TARGET.id,
            offender: ent,
            offenderId: id,
        })
    }
    private createCastEffectSprite(ent, id) {
        const targetEntity = ent.TARGET.ent
        // 📜 "sword-hit" should be taken from item, that hero is using
        if (ent.HERO) SPRITE.effect(ent, "sword-hit", targetEntity)
        else SPRITE.effect(ent, "bunbo-bite", targetEntity)
    }
    private firstCastLogic(ent, id, skill) {
        this.heroSwordAttackCastStage = 0
        this.castLogic(ent, id, skill)
        ent.SKILLS.firstCastState = false
    }
    private pre_cast_logic(ent, id, skill) {
        if (TRACK.inRange(ent, skill.distance, 3)) {
            this.createCastEffectSprite(ent, id)
            ent.SKILLS.was_visual_effect = true
        }
        ent.SKILLS.pre_cast_logic_done = true
    }
    private castLogic(ent, id, skill) {
        if (!ent.TARGET.id || ent.STATE.active !== "cast") return
        if (skill.revenge) this.revengeLogic(ent, id, skill)
        if (skill.offensive && ent.SKILLS.was_visual_effect) {
            DAMAGE.deal(ent, id, skill)
        }
        const targetHealth = ent.TARGET.ent.ATTRIBUTES.health
        if (targetHealth <= 0) this.targetDiesLogic(ent, id)
        if (skill.logic) skill.logic(ent, id)
        ent.SKILLS.castAndDelayMS = LOOP.elapsed + skill.delayMS
        ent.SKILLS.delayedLogicDone = false
        ent.SKILLS.pre_cast_logic_done = false
        ent.SKILLS.was_visual_effect = false
    }
    private delayedLogic(ent, id, skill) {
        ent.SKILLS.delayedLogicDone = true
        if (!TRACK.inRange(ent, skill.distance)) {
            ent.STATE.cast = false
            ent.SKILLS.castAndDelayMS = Infinity
            return
        } else {
            ent.TARGET.locked = true // its new target by autoAttackNext here
        }
        if (
            ent.HERO &&
            !SETTINGS.echo.general.autoAttackNext &&
            // here we have new target but not autoAttackNext
            ent.TARGET.id !== ent.TARGET.attackedId
        ) {
            ent.TARGET.id = null
            ent.TARGET.locked = false
            ent.STATE.cast = false
            ent.SKILLS.castAndDelayMS = Infinity
            return
        }

        this.alignAnimations(ent, id)
    }
    private alignAnimations(ent, id) {
        let sprite
        let spriteName = "attack"
        if (ent.HERO) {
            // "attack-sword"
            spriteName = SPRITE_UPDATE.getHeroCastSprite(HERO.ent, HERO.id)
        }
        sprite = SPRITE.getAnimation(id, spriteName)
        if (!sprite) return
        let frame = ent.SPRITE.startFrames[spriteName] - 1
        if (frame < 0) frame = sprite.totalFrames - 1
        if (ent.HERO) {
            if (!this.heroSwordAttackCastStage) {
                this.heroSwordAttackCastStage = 1
            } else {
                this.heroSwordAttackCastStage = 0
                sprite.gotoAndPlay(frame)
            }
        } else {
            sprite.gotoAndPlay(frame)
        }
    }
    private reset(ent, id) {
        ent.SKILLS.castAndDelayMS = Infinity
        ent.SKILLS.delayedLogicDone = true
    }
    process() {
        if (CONTEXT.echo.novel) return

        MUSEUM.process_entity(["STATE", "SKILLS"], (ent, id) => {
            this.stopAttackSoundsIfNotCast(ent, id)
            if (!ent.STATE.cast) {
                this.reset(ent, id)
                return
            }
            const skill = ent.SKILLS.data[ent.SKILLS.active]
            const elapsed = LOOP.elapsed
            const delayMS = ent.SKILLS.delayMS
            // if target is dead
            if (
                !ent.TARGET.id &&
                elapsed > ent.SKILLS.castAndDelayMS + delayMS
            ) {
                ent.STATE.cast = false
                return
            }
            const lastEntity = WORLD.last.entities.get(id)
            if (!lastEntity) return
            // start casting
            if (ent.STATE.cast && !lastEntity.STATE.cast) {
                ent.SKILLS.castStartMS = LOOP.elapsed
                ent.SKILLS.castAndDelayMS =
                    LOOP.elapsed - skill.castMS + skill.firstCastMS
                ent.SKILLS.firstCastState = true
            }
            if (
                !ent.SKILLS.pre_cast_logic_done &&
                elapsed >
                    ent.SKILLS.castAndDelayMS + skill.castMS - pre_cast_urge
            ) {
                this.pre_cast_logic(ent, id, skill)
            }
            if (elapsed > ent.SKILLS.castAndDelayMS + skill.castMS) {
                if (
                    LOOP.elapsed <
                    // 1.5 is just to find time between first and second cast
                    ent.SKILLS.castStartMS + skill.firstCastMS * 1.5
                ) {
                    this.firstCastLogic(ent, id, skill)
                } else {
                    this.castLogic(ent, id, skill)
                }
            }
            if (!ent.SKILLS.audioDone && ent.STATE.active !== "dead") {
                this.playAudioEffect(ent)
                ent.SKILLS.audioDone = true
            }
            if (
                !ent.SKILLS.delayedLogicDone &&
                elapsed > ent.SKILLS.castAndDelayMS
            ) {
                this.delayedLogic(ent, id, skill)
                ent.SKILLS.audioDone = false
            }
            this.updateAnimationSpeed(ent, id)
        })
    }
    private updateAnimationSpeed(ent, id) {
        let sprite
        if (ent.HERO) {
            // "attack-sword"
            const spriteName = SPRITE_UPDATE.getHeroCastSprite(
                HERO.ent,
                HERO.id
            )
            sprite = SPRITE.getAnimation(HERO.id, spriteName)
        } else {
            sprite = SPRITE.getAnimation(id, "attack")
        }
        if (!sprite) return
        sprite.animationSpeed =
            (1 / (CONFIG.max_fps / 10)) * ent.ATTRIBUTES.attackSpeed
    }
    private playAudioEffect(ent) {
        let soundId: any
        const skill = ent.SKILLS.data[ent.SKILLS.active]
        let audioDelay
        if (ent.SKILLS.firstCastState) {
            audioDelay = skill.firstCastMS + skill.audioStartMS
        } else {
            audioDelay = skill.castMS + skill.audioStartMS
        }
        ent.SKILLS.attackSoundTimeId = TIME.after(audioDelay, () => {
            // 📜 sword-hit should depend on equipped weapon
            if (ent.HERO) AUDIO.play_sound("sword-hit")
            else AUDIO.play_sound("bunbo-bite")
        })
    }
    stopAttackSoundsIfNotCast(ent, id) {
        if (ent.SKILLS.attackSoundTimeId && ent.STATE.active !== "cast") {
            TIME.cancel(ent.SKILLS.attackSoundTimeId)
            ent.SKILLS.audioDone = false
            ent.SKILLS.attackSoundTimeId = null
        }
    }
}
export const CAST = new Cast()
