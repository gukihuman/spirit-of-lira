export default class attack {
  private initial = true

  init() {
    //
    // set up animation speed
    WORLD.entities.forEach((entity, id) => {
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
    })
  }

  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.alive || !entity.size || !entity.alive.targetEntityId) {
        return
      }
      this.initial = true

      const targetEntity = WORLD.entities.get(entity.alive.targetEntityId)
      const distance = LIB.distance(entity.position, targetEntity.position)

      if (entity.alive.targetAttacked) {
        entity.alive.targetPosition = targetEntity.position
      }

      if (
        entity.alive.state === "attack" &&
        entity.attack.attackStartMS + entity.attack.speed * 1000 <=
          PIXI_GUKI.elapsedMS
      ) {
        // 📜 here check if the same target is still alive and instead of idle
        // state make a move animation, right now it moves immideately but
        // 1 iteration of non-moving causing 200ms idle animation
        // idle state is not the cause

        entity.alive.state = "idle"
      }

      // delay is like 2 frames when attack is 10
      const delay = entity.attack.speed / 5
      if (
        entity.alive.state === "attack" &&
        entity.attack.attackStartMS -
          delay * 1000 +
          entity.attack.speed * 1000 <=
          PIXI_GUKI.elapsedMS
      ) {
        //
        // 📜 add damage system
        this.damageFilter(entity.alive.targetEntityId)
      }

      const lastEntity = CACHE.entities.get(id)
      if (
        entity.alive.state === "idle" &&
        lastEntity.alive.state === "attack"
      ) {
        this.initial = false

        if (
          entity.attack.initialAttackStartMS + entity.attack.speed * 2 * 1000 <=
          PIXI_GUKI.elapsedMS
        ) {
          //
          // get animation instead of declare cuz it should already
          // be the correct one like "sword" or "bow"
          let sprite = PIXI_GUKI.getAnimationSprite(id, entity.visual.animation)
          sprite?.gotoAndPlay(14)
          this.initial = true
          console.log("aligned")
        }
      }

      if (
        entity.alive.state !== "attack" &&
        entity.alive.state !== "forcemove"
      ) {
        if (distance < targetEntity.size.width / 2 + entity.attack.distance) {
          entity.attack.attackStartMS = PIXI_GUKI.elapsedMS
          entity.alive.state = "attack"

          if (this.initial) {
            console.log("updated")
            entity.attack.initialAttackStartMS = PIXI_GUKI.elapsedMS
          }
        }
      }
    })
  }

  private damageFilter = (targetId) => {
    const targetEntity = WORLD.entities.get(targetId)
    targetEntity.attack.damageFilterStartMS = PIXI_GUKI.elapsedMS

    const container = PIXI_GUKI.getAnimationContainer(targetId)

    if (container) {
      container.filters = [
        new PIXI_FILTERS.AdvancedBloomFilter({
          quality: 2,
          bloomScale: 0.23,
          blur: 6,
        }),
      ]
      if (GLOBAL.hero.alive.targetAttacked) {
        container.filters.push(
          new PIXI_FILTERS.AdjustmentFilter({
            red: 4,
            saturation: 0.9,
            brightness: 0.6,
          })
        )
      }
    }
  }
}
