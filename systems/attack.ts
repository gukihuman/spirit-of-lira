export default class attack {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.alive || !entity.size || !entity.alive.targetEntityId) {
        return
      }

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
        entity.alive.state = "idle"
      }

      if (
        entity.alive.state === "attack" &&
        entity.attack.attackStartMS -
          entity.attack.delay * 1000 +
          entity.attack.speed * 1000 <=
          PIXI_GUKI.elapsedMS
      ) {
        //
        // 📜 add damage system
        this.damageFilter(entity.alive.targetEntityId)
      }

      // 📜 stetchy code to catch old attack before start new attack and align animation
      // const lastEntity = CACHE.entities.get(id)
      // if (
      //   entity.alive.state === "idle" &&
      //   lastEntity.alive.state === "attack"
      // ) {
      //   // get animation instead of declare cuz it should already
      //   // be the correct one like "sword" or "bow"
      //   let sprite = PIXI_GUKI.getAnimationSprite(id, entity.visual.animation)
      //   sprite?.gotoAndPlay(0)
      // }

      if (
        entity.alive.state !== "attack" &&
        entity.alive.state !== "forcemove"
      ) {
        if (distance < targetEntity.size.width / 2 + entity.attack.distance) {
          entity.attack.attackStartMS = PIXI_GUKI.elapsedMS
          entity.alive.state = "attack"
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
