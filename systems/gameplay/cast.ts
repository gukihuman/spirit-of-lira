export default class {
  private cast(slot = "slot1") {
    if (GLOBAL.context !== "world") return
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
      const targetEntity = entity.target.entity
      if (!targetEntity || targetEntity.state.active === "dead") return
      entity.skills.active = entity.skills[slot]
      entity.state.track = true
      entity.target.locked = true
    })
  }
  private targetDiesLogic(entity, id) {
    entity.target.id = undefined
    entity.target.locked = false
    if (LIB.hero(id)) {
      if (!SETTINGS.gameplay.easyFight) entity.state.track = false
      entity.move.finaldestination = _.cloneDeep(entity.position)
      WORLD.systems.move.lastMobKilledMS = WORLD.loop.elapsedMS
    }
  }
  private revengeLogic(entity, id, skill) {
    EVENTS.emit("revenge", {
      entity: entity.target.entity,
      id: entity.target.id,
      offender: entity,
      offenderId: id,
    })
  }
  private dealDamage(entity, id, skill) {
    if (LIB.hero(id)) {
      let weaponDamage = 0
      const weapon = INVENTORY.equipped.weapon
      if (weapon) weaponDamage = ITEMS.weapons[weapon].damage
      entity.target.entity.attributes.health -= weaponDamage
    } else {
      entity.target.entity.attributes.health -= skill.damage
    }
  }
  private firstCastLogic(entity, id, skill) {
    this.castLogic(entity, id, skill)
    entity.skills.lastFirstStartMS = Infinity
  }
  private chooseEffectSprite(entity, id) {
    const targetEntity = entity.target.entity
    if (LIB.hero(id)) SPRITE.effect(entity, "sword-hit", targetEntity)
    else SPRITE.effect(entity, "bunbo-bite", targetEntity)
  }
  private castLogic(entity, id, skill) {
    if (!entity.target.id) return
    this.chooseEffectSprite(entity, id)
    if (skill.offensive) this.dealDamage(entity, id, skill)
    if (skill.revenge) this.revengeLogic(entity, id, skill)
    const targetHealth = entity.target.entity.attributes.health
    if (targetHealth <= 0) this.targetDiesLogic(entity, id)
    if (skill.logic) skill.logic(entity, id)
    entity.skills.lastDoneMS = WORLD.loop.elapsedMS + skill.delayMS
    entity.skills.delayedLogicDone = false
  }
  private delayedLogic(entity, id, skill) {
    const inRange = WORLD.systems.track.inRange
    const targetEntity = entity.target.entity
    if (!inRange(entity, id, targetEntity, skill.distance)) {
      entity.state.cast = false
      entity.skills.lastDoneMS = Infinity
    }
    entity.skills.delayedLogicDone = true
  }
  private reset(entity, id) {
    entity.skills.lastFirstStartMS = Infinity
    entity.skills.lastDoneMS = Infinity
    entity.skills.delayedLogicDone = true
  }
  process() {
    if (GLOBAL.context === "scene") return
    WORLD.entities.forEach((entity, id) => {
      if (!entity.state || !entity.skills) return
      if (!entity.state.cast) {
        this.reset(entity, id)
        return
      }
      const lastEntity = LAST_WORLD.entities.get(id)
      if (!lastEntity) return
      if (entity.state.cast && !lastEntity.state.cast) {
        entity.skills.lastFirstStartMS = WORLD.loop.elapsedMS
      }
      const skill = entity.skills.data[entity.skills.active]
      const elapsedMS = WORLD.loop.elapsedMS
      const delayMS = entity.skills.delayMS
      // if target is dead
      if (!entity.target.id && elapsedMS > entity.skills.lastDoneMS + delayMS) {
        entity.state.cast = false
        return
      }
      if (elapsedMS > entity.skills.lastFirstStartMS + skill.firstCastMS) {
        this.firstCastLogic(entity, id, skill)
      }
      if (elapsedMS > entity.skills.lastDoneMS + skill.castMS) {
        this.castLogic(entity, id, skill)
      }
      if (
        !entity.skills.delayedLogicDone &&
        elapsedMS > entity.skills.lastDoneMS
      ) {
        this.delayedLogic(entity, id, skill)
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
