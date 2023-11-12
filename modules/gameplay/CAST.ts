class Cast {
  attackSoundIds: any = []
  private cast(slot = "slot1") {
    EVENTS.emit("cast", {
      entity: WORLD.hero,
      slot: slot,
    })
  }
  init() {
    EVENTS.onSingle("cast1", () => this.cast("slot1"))
    EVENTS.onSingle("cast2", () => this.cast("slot2"))
    EVENTS.onSingle("cast3", () => this.cast("slot3"))
    EVENTS.onSingle("cast4", () => this.cast("slot4"))
    EVENTS.on("cast", ({ entity, slot }) => {
      const targetEntity = entity.TARGET.entity
      if (!targetEntity || targetEntity.STATE.active === "dead") return
      entity.SKILLS.active = entity.SKILLS[slot]
      entity.STATE.track = true
      entity.TARGET.locked = true
    })
  }
  private targetDiesLogic(entity, id) {
    entity.TARGET.id = undefined
    entity.TARGET.locked = false
    if (WORLD.isHero(id)) {
      if (!SETTINGS.gameplay.easyFight) entity.STATE.track = false
      entity.MOVE.finaldestination = _.cloneDeep(entity.POSITION)
      MOVE.lastMobKilledMS = WORLD.loop.elapsedMS
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
  private dealDamage(entity, id, skill) {
    if (WORLD.isHero(id)) {
      let weaponDamage = 0
      const weapon = INVENTORY.gear.weapon
      if (weapon) weaponDamage = ITEMS.collection.weapons[weapon].damage
      entity.TARGET.entity.ATTRIBUTES.health -= weaponDamage
    } else {
      entity.TARGET.entity.ATTRIBUTES.health -= skill.damage
    }
  }
  private firstCastLogic(entity, id, skill) {
    this.castLogic(entity, id, skill)
    entity.SKILLS.lastFirstStartMS = Infinity
  }
  private chooseEffectSprite(entity, id) {
    const targetEntity = entity.TARGET.entity
    // 📜 "sword-hit" should be taken from item, that hero is using
    if (WORLD.isHero(id)) SPRITE.effect(entity, "sword-hit", targetEntity)
    else SPRITE.effect(entity, "bunbo-bite", targetEntity)
  }
  private chooseEffectAudio(entity, id) {
    let soundId: any
    const skill = entity.SKILLS.data[entity.SKILLS.active]
    // 📜 0.8 and "sword-hit" should be taken from item, that hero is using
    let audioDelay
    if (entity.SKILLS.firstCastState) audioDelay = skill.firstCastMS * 0.95
    else audioDelay = skill.castMS * 0.95
    if (WORLD.isHero(id)) soundId = AUDIO.play("sword-hit", audioDelay)
    else soundId = AUDIO.play("bunbo-bite")
    entity.SKILLS.attackSoundId = soundId
  }
  stopAttackSounds() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.SKILLS) return
      if (entity.SKILLS.attackSoundId && entity.STATE.active !== "cast") {
        AUDIO.stop(entity.SKILLS.attackSoundId, 30)
        entity.SKILLS.audioDone = false
        entity.SKILLS.attackSoundId = undefined
      }
    })
  }
  private castLogic(entity, id, skill) {
    if (!entity.TARGET.id) return
    this.chooseEffectSprite(entity, id)
    if (skill.offensive) this.dealDamage(entity, id, skill)
    if (skill.revenge) this.revengeLogic(entity, id, skill)
    const targetHealth = entity.TARGET.entity.ATTRIBUTES.health
    if (targetHealth <= 0) this.targetDiesLogic(entity, id)
    if (skill.logic) skill.logic(entity, id)
    entity.SKILLS.lastDoneMS = WORLD.loop.elapsedMS + skill.delayMS
    entity.SKILLS.delayedLogicDone = false
  }
  private delayedLogic(entity, id, skill) {
    const inRange = TRACK.inRange
    const targetEntity = entity.TARGET.entity
    if (!inRange(entity, id, targetEntity, skill.distance)) {
      entity.STATE.cast = false
      entity.SKILLS.lastDoneMS = Infinity
    }
    entity.SKILLS.delayedLogicDone = true
  }
  private reset(entity, id) {
    entity.SKILLS.lastFirstStartMS = Infinity
    entity.SKILLS.lastDoneMS = Infinity
    entity.SKILLS.delayedLogicDone = true
  }

  process() {
    if (GLOBAL.context === "scene") return
    this.stopAttackSounds()
    WORLD.entities.forEach((entity, id) => {
      if (!entity.STATE || !entity.SKILLS) return
      if (!entity.STATE.cast) {
        this.reset(entity, id)
        return
      }
      const lastEntity = LAST.entities.get(id)
      if (!lastEntity) return
      if (entity.STATE.cast && !lastEntity.STATE.cast) {
        entity.SKILLS.lastFirstStartMS = WORLD.loop.elapsedMS
      }
      const skill = entity.SKILLS.data[entity.SKILLS.active]
      const elapsedMS = WORLD.loop.elapsedMS
      const delayMS = entity.SKILLS.delayMS
      // if target is dead
      if (!entity.TARGET.id && elapsedMS > entity.SKILLS.lastDoneMS + delayMS) {
        entity.STATE.cast = false
        return
      }
      if (elapsedMS > entity.SKILLS.lastFirstStartMS + skill.firstCastMS) {
        this.firstCastLogic(entity, id, skill)
      }
      if (elapsedMS > entity.SKILLS.lastDoneMS + skill.castMS) {
        this.castLogic(entity, id, skill)
      }
      if (!entity.SKILLS.audioDone) {
        this.chooseEffectAudio(entity, id)
        entity.SKILLS.audioDone = true
      }
      if (
        !entity.SKILLS.delayedLogicDone &&
        elapsedMS > entity.SKILLS.lastDoneMS
      ) {
        this.delayedLogic(entity, id, skill)
        entity.SKILLS.audioDone = false
      }
    })
  }

  // 📜 make animation sync after adding effects for convinience
  // private updateAnimationSpeed(entity, id) {
  //   //
  //   // set up animation speed
  //   if (!entity.attack) return

  //   if (id === WORLD.heroId) {
  //     //
  //     // 📜 make attack animation dynamic depend on weapon or skill
  //     const sprite = SPRITE.getAnimation(id, "sword-attack")
  //     if (!sprite) return

  //     sprite.animationSpeed = 1.2 / entity.attack.speed / 6
  //   } else {
  //     const sprite = SPRITE.getAnimation(id, "attack")
  //     if (!sprite) return

  //     sprite.animationSpeed = 1.2 / entity.attack.speed / 6
  //   }
  // }
}
export const CAST = new Cast()
