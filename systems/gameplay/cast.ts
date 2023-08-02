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
      entity.skills.active = entity.skills[slot]
      entity.state.track = true
      entity.target.locked = true
    })
  }
  private castLogic(entity, id, skill) {
    skill.logic(entity, id)
    entity.skills.lastDoneMS = WORLD.loop.elapsedMS + skill.delayMS
    entity.skills.delayedLogicDone = false
  }
  private delayedLogic(entity, id, skill) {
    if (
      !WORLD.systems.track.checkDistance(
        entity,
        entity.target.entity,
        skill.distance
      )
    ) {
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
      // if target is dead
      if (
        !entity.target.id &&
        WORLD.loop.elapsedMS > entity.skills.lastDoneMS + entity.skills.delayMS
      ) {
        entity.state.cast = false
        return
      }
      const skill = entity.skills.data[entity.skills.active]
      // first in a sequence
      if (
        WORLD.loop.elapsedMS >
        entity.skills.lastFirstStartMS + skill.firstCastMS
      ) {
        this.castLogic(entity, id, skill)
        entity.skills.lastFirstStartMS = Infinity
      }
      if (WORLD.loop.elapsedMS > entity.skills.lastDoneMS + skill.castMS) {
        this.castLogic(entity, id, skill)
      }
      if (
        !entity.skills.delayedLogicDone &&
        WORLD.loop.elapsedMS > entity.skills.lastDoneMS
      ) {
        this.delayedLogic(entity, id, skill)
      }
    })
  }

  // 📜 make animation sync
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
