export default class attack {
  private initialAttack = true

  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move || !entity.size || !entity.move.targetEntityId) {
        return
      }
      this.initialAttack = true

      this.updateAnimationSpeed(entity, id)

      const targetEntity = WORLD.entities.get(entity.move.targetEntityId)
      if (!targetEntity) {
        entity.move.state = "idle"
        return
      }

      const distance = LIB.distance(entity.position, targetEntity.position)

      if (entity.move.targetAttacked) {
        entity.move.destination = _.cloneDeep(targetEntity.position)
      } else {
        return
      }

      // delay is like 2 frames when attack is 10
      const delay = (entity.attack.speed / entity.attack.delay) * 1000

      if (
        entity.move.state === "attack" &&
        entity.attack.attackStartMS + entity.attack.speed * 1000 <=
          GPIXI.elapsedMS
      ) {
        if (targetEntity.move.state !== "dead") {
          entity.move.state = "idle"
          WORLD.systems.get("move").process()
        }

        entity.move.state = "idle"
        entity.damageDone = false
      }

      if (
        entity.move.state === "attack" &&
        entity.attack.attackStartMS - delay + entity.attack.speed * 1000 <=
          GPIXI.elapsedMS &&
        !entity.damageDone
      ) {
        // damage done here
        WORLD.systems.get("damage").events.push({
          entityId: id,
          targetEntityId: entity.move.targetEntityId,
        })
        entity.damageDone = true
      }

      const lastEntity = CACHE.entities.get(id)
      if (
        entity.move.state !== "attack" &&
        lastEntity.move.state === "attack"
      ) {
        this.initialAttack = false

        if (
          entity.attack.initialAttackStartMS + entity.attack.speed * 2 * 1000 <=
            GPIXI.elapsedMS &&
          id === GLOBAL.heroId
        ) {
          //
          // get animation instead of declare cuz it should already
          // be the correct one like "sword" or "bow"
          let sprite = GPIXI.getSprite(id, entity.visual.animation)
          sprite?.gotoAndPlay(14)
          this.initialAttack = true
        }
      }

      if (entity.move.state !== "attack" && entity.move.state !== "forcemove") {
        if (distance < targetEntity.size.width / 2 + entity.attack.distance) {
          entity.attack.attackStartMS = GPIXI.elapsedMS
          entity.move.state = "attack"

          if (this.initialAttack) {
            entity.attack.initialAttackStartMS = GPIXI.elapsedMS
          }
        }
      }
    })
  }

  private updateAnimationSpeed(entity, id) {
    //
    // set up animation speed
    if (!entity.attack) return

    if (id === GLOBAL.heroId) {
      //
      // 📜 later add all attack animations
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
