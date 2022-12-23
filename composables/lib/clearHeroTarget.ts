export function clearHeroTarget() {
  Game().entities.forEach((entity) => {
    if (entity.creature) {
      entity.isHeroTarget = false
    }
  })
}
