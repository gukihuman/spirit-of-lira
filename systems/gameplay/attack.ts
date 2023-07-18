export default class {
  private initialAttack = true

  process() {
    ENTITIES.forEach((entity, id) => {
      if (!entity.move || !entity.size || !entity.target.id) {
        return
      }
      this.initialAttack = true

      this.updateAnimationSpeed(entity, id)

      const targetEntity = ENTITIES.get(entity.target.id)
      if (!targetEntity) {
        entity.state.main = "idle"
        return
      }

      const distance = LIB.distance(entity.position, targetEntity.position)

      if (entity.target.attacked) {
        if (
          SYSTEM_DATA.world.heroId === id &&
          GPIXI.elapsedMS < SYSTEMS.move.startMoveToAttackMS + 1000 &&
          SYSTEMS.move.gamepadMoved
        ) {
          return
        }
        entity.move.finaldestination = _.cloneDeep(targetEntity.position)
      } else {
        return
      }

      const delay = entity.attack.delay * 1000

      if (
        entity.state.main === "attack" &&
        entity.attack.startMS + entity.attack.speed * 1000 <= GPIXI.elapsedMS
      ) {
        if (targetEntity.state.main !== "dead") {
          entity.state.main = "idle"
          SYSTEMS.move.process()
        }

        entity.state.main = "idle"
        entity.damageDone = false
      }

      if (
        entity.state.main === "attack" &&
        entity.attack.startMS - delay + entity.attack.speed * 1000 <=
          GPIXI.elapsedMS &&
        !entity.damageDone
      ) {
        // damage done here
        SYSTEMS.damage.events.push({
          entityId: id,
          targetEntityId: entity.target.id,
        })
        entity.damageDone = true
      }

      const lastEntity = SYSTEMS.lasttick.entities.get(id)
      if (
        entity.state.main !== "attack" &&
        lastEntity.state.main === "attack"
      ) {
        this.initialAttack = false

        if (
          entity.attack.initialStartMS + entity.attack.speed * 2 * 1000 <=
            GPIXI.elapsedMS &&
          id === SYSTEM_DATA.world.heroId
        ) {
          //
          // get animation instead of declare cuz it should already
          // be the correct one like "sword" or "bow"
          let sprite = GPIXI.getSprite(id, entity.sprite.animation)
          let startFrame = entity.sprite.firstFrames[entity.sprite.animation]
          sprite?.gotoAndPlay(startFrame)
          this.initialAttack = true
        }
      }

      if (entity.state.main !== "attack" && entity.state.main !== "forcemove") {
        if (distance < targetEntity.size.width / 2 + entity.attack.distance) {
          entity.attack.startMS = GPIXI.elapsedMS
          entity.state.main = "attack"

          if (this.initialAttack) {
            entity.attack.initialStartMS = GPIXI.elapsedMS
          }
        }
      }
    })
  }

  private updateAnimationSpeed(entity, id) {
    //
    // set up animation speed
    if (!entity.attack) return

    if (id === SYSTEM_DATA.world.heroId) {
      //
      // 📜 make attack animation dynamic depend on weapon or skill
      const sprite = GPIXI.getSprite(id, "sword-attack")
      if (!sprite) return

      sprite.animationSpeed = 1.2 / entity.attack.speed / 6
    } else {
      const sprite = GPIXI.getSprite(id, "attack")
      if (!sprite) return

      sprite.animationSpeed = 1.2 / entity.attack.speed / 6
    }
  }
}
