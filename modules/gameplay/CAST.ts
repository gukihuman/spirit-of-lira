// no damage if target go away based on skill distance
class Cast {
    attackSoundIds: any = []
    heroSwordAttackCastStage: 0 | 1 = 0 // animation stage
    private cast(slot = "slot1") {
        if (!GAME_STATE.echo.world?.gameplay) return
        EVENTS.emit("cast", {
            entity: HERO.entity,
            slot: slot,
        })
    }
    init() {
        EVENTS.onSingle("decide", () => {
            if (INTERFACE.buttonHover) return
            if (GLOBAL.hoverId) {
                if (GLOBAL.hoverId !== HERO.entity.TARGET.id) {
                    HERO.entity.TARGET.id = GLOBAL.hoverId
                    HERO.entity.STATE.idle = true
                    HERO.entity.STATE.cast = false
                    HERO.entity.STATE.active = "idle"
                }
                EVENTS.emitSingle("cast1")
                EVENTS.emitSingle("lockTarget")
            } else MOVE.mouseMove()
        })
        EVENTS.onSingle("cast1", () => this.cast("slot1"))
        EVENTS.onSingle("cast2", () => this.cast("slot2"))
        EVENTS.onSingle("cast3", () => this.cast("slot3"))
        EVENTS.onSingle("cast4", () => this.cast("slot4"))
        EVENTS.on("cast", ({ entity, slot }) => {
            if (
                !entity.TARGET.entity ||
                entity.TARGET.entity.STATE.active === "dead"
            ) {
                return
            }
            entity.SKILLS.active = entity.SKILLS[slot]
            entity.STATE.track = true
            entity.TARGET.locked = true // important even for hero :)
            entity.TARGET.attackedId = entity.TARGET.id
        })
    }
    private targetDiesLogic(entity, id) {
        entity.TARGET.id = undefined
        entity.TARGET.locked = false
        entity.MOVE.final_destination = _.cloneDeep(entity.POSITION)
        if (entity.HERO) {
            if (!SETTINGS.general.easyFight) {
                entity.STATE.track = false
            } else {
                TIME.run_after_iterations(() => {
                    // its new target by easyFight here
                    entity.TARGET.locked = true
                })
            }
            MOVE.lastMobKilledMS = LOOP.elapsed // prevent gamepad move on delay
        }
    }
    private revengeLogic(entity, id, skill) {
        EVENTS.emit("revenge", {
            entity: entity.TARGET.entity,
            id: entity.TARGET.id,
            offender: entity,
            offenderId: id,
        })
    }
    private createCastEffectSprite(entity, id) {
        const targetEntity = entity.TARGET.entity
        // 📜 "sword-hit" should be taken from item, that hero is using
        if (entity.HERO) SPRITE.effect(entity, "sword-hit", targetEntity)
        else SPRITE.effect(entity, "bunbo-bite", targetEntity)
    }
    private firstCastLogic(entity, id, skill) {
        this.heroSwordAttackCastStage = 0
        this.castLogic(entity, id, skill)
        entity.SKILLS.firstCastState = false
    }
    private castLogic(entity, id, skill) {
        if (!entity.TARGET.id || entity.STATE.active !== "cast") return
        if (TRACK.inRange(entity, skill.distance, 3)) {
            this.createCastEffectSprite(entity, id)
            if (skill.offensive) DAMAGE.deal(entity, id, skill)
        }
        if (skill.revenge) this.revengeLogic(entity, id, skill)
        const targetHealth = entity.TARGET.entity.ATTRIBUTES.health
        if (targetHealth <= 0) this.targetDiesLogic(entity, id)
        if (skill.logic) skill.logic(entity, id)
        entity.SKILLS.castAndDelayMS = LOOP.elapsed + skill.delayMS
        entity.SKILLS.delayedLogicDone = false
    }
    private delayedLogic(entity, id, skill) {
        entity.SKILLS.delayedLogicDone = true
        if (!TRACK.inRange(entity, skill.distance)) {
            entity.STATE.cast = false
            entity.SKILLS.castAndDelayMS = Infinity
            return
        } else {
            entity.TARGET.locked = true // its new target by easyFight here
        }
        if (
            entity.HERO &&
            !SETTINGS.general.easyFight &&
            // here we have new target but not easyFight
            entity.TARGET.id !== entity.TARGET.attackedId
        ) {
            entity.TARGET.id = null
            entity.TARGET.locked = false
            entity.STATE.cast = false
            entity.SKILLS.castAndDelayMS = Infinity
            return
        }

        this.alignAnimations(entity, id)
    }
    private alignAnimations(entity, id) {
        let sprite
        let spriteName = "attack"
        if (entity.HERO) {
            // "attack-sword"
            spriteName = SPRITE_UPDATE.getHeroCastSprite(HERO.entity, HERO.id)
        }
        sprite = SPRITE.getAnimation(id, spriteName)
        if (!sprite) return
        let frame = entity.SPRITE.startFrames[spriteName] - 1
        if (frame < 0) frame = sprite.totalFrames - 1
        if (entity.HERO) {
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
    private reset(entity, id) {
        entity.SKILLS.castAndDelayMS = Infinity
        entity.SKILLS.delayedLogicDone = true
    }
    process() {
        if (GAME_STATE.echo.scene) return
        MUSEUM.processEntity(["STATE", "SKILLS"], (entity, id) => {
            this.stopAttackSoundsIfNotCast(entity, id)
            if (!entity.STATE.cast) {
                this.reset(entity, id)
                return
            }
            const skill = entity.SKILLS.data[entity.SKILLS.active]
            const elapsed = LOOP.elapsed
            const delayMS = entity.SKILLS.delayMS
            // if target is dead
            if (
                !entity.TARGET.id &&
                elapsed > entity.SKILLS.castAndDelayMS + delayMS
            ) {
                entity.STATE.cast = false
                return
            }
            const lastEntity = LAST.entities.get(id)
            if (!lastEntity) return
            // start casting
            if (entity.STATE.cast && !lastEntity.STATE.cast) {
                entity.SKILLS.castStartMS = LOOP.elapsed
                entity.SKILLS.castAndDelayMS =
                    LOOP.elapsed - skill.castMS + skill.firstCastMS
                entity.SKILLS.firstCastState = true
            }
            if (elapsed > entity.SKILLS.castAndDelayMS + skill.castMS) {
                if (
                    LOOP.elapsed <
                    // 1.5 is just to find time between first and second cast :)
                    entity.SKILLS.castStartMS + skill.firstCastMS * 1.5
                ) {
                    this.firstCastLogic(entity, id, skill)
                } else {
                    this.castLogic(entity, id, skill)
                }
            }
            if (!entity.SKILLS.audioDone && entity.STATE.active !== "dead") {
                this.playAudioEffect(entity)
                entity.SKILLS.audioDone = true
            }
            if (
                !entity.SKILLS.delayedLogicDone &&
                elapsed > entity.SKILLS.castAndDelayMS
            ) {
                this.delayedLogic(entity, id, skill)
                entity.SKILLS.audioDone = false
            }
            this.updateAnimationSpeed(entity, id)
        })
    }
    private updateAnimationSpeed(entity, id) {
        let sprite
        if (entity.HERO) {
            // "attack-sword"
            const spriteName = SPRITE_UPDATE.getHeroCastSprite(
                HERO.entity,
                HERO.id
            )
            sprite = SPRITE.getAnimation(HERO.id, spriteName)
        } else {
            sprite = SPRITE.getAnimation(id, "attack")
        }
        if (!sprite) return
        sprite.animationSpeed =
            (1 / (CONFIG.max_fps / 10)) * entity.ATTRIBUTES.attackSpeed
    }
    private playAudioEffect(entity) {
        let soundId: any
        const skill = entity.SKILLS.data[entity.SKILLS.active]
        // 📜 0.8 and "sword-hit" should be taken from item for hero and from entity for mobs
        let audioDelay
        if (entity.SKILLS.firstCastState) {
            audioDelay = skill.firstCastMS + skill.audioStartMS
        } else {
            audioDelay = skill.castMS + skill.audioStartMS
        }
        if (entity.HERO) soundId = AUDIO.play("sword-hit", audioDelay)
        else soundId = AUDIO.play("bunbo-bite", audioDelay)
        entity.SKILLS.attackSoundId = soundId
    }
    stopAttackSoundsIfNotCast(entity, id) {
        if (entity.SKILLS.attackSoundId && entity.STATE.active !== "cast") {
            AUDIO.stop(entity.SKILLS.attackSoundId, 30)
            entity.SKILLS.audioDone = false
            entity.SKILLS.attackSoundId = null
        }
    }
}
export const CAST = new Cast()
