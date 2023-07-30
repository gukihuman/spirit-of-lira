//
export default class {
  //
  private firstAttack = true

  init() {
    EVENTS.onSingle("attack", () => {
      //
      if (!WORLD.hero.target.id) return

      WORLD.hero.target.attacked = true
      WORLD.hero.target.locked = true

      WORLD.systems.move.startMoveToAttackMS = WORLD.loop.elapsedMS
    })
  }

  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.move || !entity.size || !entity.target.id) {
        return
      }
      this.firstAttack = true

      this.updateAnimationSpeed(entity, id)

      const targetEntity = WORLD.entities.get(entity.target.id)
      if (!targetEntity) {
        entity.state.active = "idle"
        return
      }

      const distance = COORDINATES.distance(
        entity.position,
        targetEntity.position
      )

      if (entity.target.attacked) {
        if (
          WORLD.heroId === id &&
          WORLD.loop.elapsedMS <
            WORLD.systems.move.startMoveToAttackMS + 1000 &&
          WORLD.systems.move.gamepadMoved
        ) {
          return
        }
        entity.move.finaldestination = _.cloneDeep(targetEntity.position)
      } else {
        return
      }

      const delay = entity.attack.delay * 1000

      if (
        entity.state.active === "attack" &&
        entity.attack.startMS + entity.attack.speed * 1000 <=
          WORLD.loop.elapsedMS
      ) {
        if (targetEntity.state.active !== "dead") {
          entity.state.active = "idle"
          WORLD.systems.move.process()
        }

        entity.state.active = "idle"
        entity.damageDone = false
      }

      if (
        entity.state.active === "attack" &&
        entity.attack.startMS - delay + entity.attack.speed * 1000 <=
          WORLD.loop.elapsedMS &&
        !entity.damageDone
      ) {
        // damage done here
        WORLD.systems.damage.events.push({
          entityId: id,
          targetEntityId: entity.target.id,
        })
        entity.damageDone = true
      }

      const lastEntity = LAST_WORLD.entities.get(id)
      if (
        entity.state.active !== "attack" &&
        lastEntity.state.active === "attack"
      ) {
        this.firstAttack = false

        if (
          entity.attack.initialStartMS + entity.attack.speed * 2 * 1000 <=
            WORLD.loop.elapsedMS &&
          id === WORLD.heroId
        ) {
          //
          // get animation instead of declare cuz it should already
          // be the correct one like "sword" or "bow"
          let sprite = WORLD.getAnimation(id, entity.sprite.active)
          let startFrame = entity.sprite.startFrames[entity.sprite.active]
          if (!startFrame) startFrame = 0
          sprite?.gotoAndPlay(startFrame)
          this.firstAttack = true
        }
      }

      if (
        entity.state.active !== "attack" &&
        entity.state.active !== "forcemove"
      ) {
        if (distance < targetEntity.size.width / 2 + entity.attack.distance) {
          entity.attack.startMS = WORLD.loop.elapsedMS
          entity.state.active = "attack"

          if (this.firstAttack) {
            entity.attack.initialStartMS = WORLD.loop.elapsedMS
          }
        }
      }
    })
  }

  private updateAnimationSpeed(entity, id) {
    //
    // set up animation speed
    if (!entity.attack) return

    if (id === WORLD.heroId) {
      //
      // 📜 make attack animation dynamic depend on weapon or skill
      const sprite = WORLD.getAnimation(id, "sword-attack")
      if (!sprite) return

      sprite.animationSpeed = 1.2 / entity.attack.speed / 6
    } else {
      const sprite = WORLD.getAnimation(id, "attack")
      if (!sprite) return

      sprite.animationSpeed = 1.2 / entity.attack.speed / 6
    }
  }
}
