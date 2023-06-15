export default class attack {
  private initialAttack = true

  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.alive || !entity.size || !entity.alive.targetEntityId) {
        return
      }
      this.initialAttack = true

      this.updateAnimationSpeed(entity, id)

      const targetEntity = WORLD.entities.get(entity.alive.targetEntityId)
      if (!targetEntity) {
        entity.alive.state = "idle"
        return
      }

      const distance = LIB.distance(entity.position, targetEntity.position)

      if (entity.alive.targetAttacked) {
        entity.alive.targetPosition = targetEntity.position
      } else {
        return
      }

      // delay is like 2 frames when attack is 10
      const delay = (entity.attack.speed / entity.attack.delay) * 1000

      if (
        entity.alive.state === "attack" &&
        entity.attack.attackStartMS + entity.attack.speed * 1000 <=
          PIXI_GUKI.elapsedMS
      ) {
        if (targetEntity.alive.state !== "dead") {
          entity.alive.state = "idle"
          WORLD.systems.get("move").process()
        }

        entity.alive.state = "idle"
        entity.damageDone = false
      }

      if (
        entity.alive.state === "attack" &&
        entity.attack.attackStartMS - delay + entity.attack.speed * 1000 <=
          PIXI_GUKI.elapsedMS &&
        !entity.damageDone
      ) {
        // damage done here
        WORLD.systems.get("damage").events.push({
          entityId: id,
          targetEntityId: entity.alive.targetEntityId,
        })
        entity.damageDone = true
      }

      const lastEntity = CACHE.entities.get(id)
      if (
        entity.alive.state !== "attack" &&
        lastEntity.alive.state === "attack"
      ) {
        this.initialAttack = false

        if (
          entity.attack.initialAttackStartMS + entity.attack.speed * 2 * 1000 <=
            PIXI_GUKI.elapsedMS &&
          id === GLOBAL.heroId
        ) {
          //
          // get animation instead of declare cuz it should already
          // be the correct one like "sword" or "bow"
          let sprite = PIXI_GUKI.getAnimationSprite(id, entity.visual.animation)
          sprite?.gotoAndPlay(14)
          this.initialAttack = true
        }
      }

      if (
        entity.alive.state !== "attack" &&
        entity.alive.state !== "forcemove"
      ) {
        if (distance < targetEntity.size.width / 2 + entity.attack.distance) {
          entity.attack.attackStartMS = PIXI_GUKI.elapsedMS
          entity.alive.state = "attack"

          if (this.initialAttack) {
            entity.attack.initialAttackStartMS = PIXI_GUKI.elapsedMS
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
      const sprite = PIXI_GUKI.getAnimationSprite(id, "sword-attack")
      if (!sprite) return

      sprite.animationSpeed = 1.2 / entity.attack.speed / 6
    } else {
      const sprite = PIXI_GUKI.getAnimationSprite(id, "attack")
      if (!sprite) return

      sprite.animationSpeed = 1.2 / entity.attack.speed / 6
    }
  }
}
