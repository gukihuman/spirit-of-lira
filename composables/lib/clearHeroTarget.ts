export function clearHeroTarget() {
  Game().entities.forEach((entity) => {
    if (entity.isCreature) {
      entity.isHeroTarget = false
    }
  })
}
