export default {
  name: "targetpoint",
  visual: { parentContainer: "ground" },
  process(entity, id) {
    let position = entity.position
    if (!position) return

    if (!gg.hero.alive.targetEntity) {
      position.x = 0
      position.y = 0
      return
    }
    const targetPosition = gg.hero.alive.targetEntity.position
    position.x = targetPosition.x
    position.y = targetPosition.y

    const container = gpixi.getContainer(id)
    if (container) {
      container.children[1].angle += 80 * gpixi.deltaSec
      const scale = 1 * (gg.hero.alive.targetEntity.alive.size / 30)
      container.scale = { x: 1, y: 0.5 }
      container.scale.x *= scale
      container.scale.y *= scale
      const animationSprite = gpixi.getAnimationSprite(id, "idle")
      if (!animationSprite) return
    }
  },
}
