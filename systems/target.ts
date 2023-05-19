export default class target {
  process() {
    //
    // set target for all alive entities
    gworld.entities.forEach((entity, id) => {
      if (!entity.alive) return
      let minDistance = Infinity
      gworld.entities.forEach((otherEntity, otherId) => {
        if (id === otherId || !otherEntity.alive) return
        const displacement = glib.vectorFromPoints(
          entity.position,
          otherEntity.position
        )
        if (displacement.distance < minDistance) {
          minDistance = displacement.distance
          entity.alive.targetEntity = otherEntity
          entity.alive.targetEntityId = otherId
        }
      })

      let maxTargetDistance = 300
      if (id === gg.heroId) maxTargetDistance = 530

      if (minDistance > maxTargetDistance) {
        entity.alive.targetEntity = undefined
        entity.alive.targetEntityId = undefined
      }
    })

    glib.cleanFiltersById(gg.lastHero.alive.targetEntityId)
    const newContainer = gpixi.getAnimationContainer(
      gg.hero.alive.targetEntityId
    )
    if (newContainer) {
      newContainer.filters = [
        new PIXIfilters.GlowFilter({
          distance: 20,
          innerStrength: 2,
          outerStrength: 2,
          color: 0x943110,
          alpha: 0.2,
        }),
        new PIXIfilters.HslAdjustmentFilter({
          hue: 10,
          colorize: true,
          alpha: 0.2,
        }),
      ]
    }
  }
}
