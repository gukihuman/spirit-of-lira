export default {
  name: "mousepoint",
  visual: { parentContainer: "ground" },
  process(entity, id) {
    let position = entity.position
    if (!position) return

    const targetPosition = gg.hero.alive.targetPosition
    if (!targetPosition) {
      position.x = 0
      position.y = 0
      return
    }
    position.x = targetPosition.x
    position.y = targetPosition.y

    const displacement = glib.vectorFromPoints(
      position,
      gworld.entities.get(gg.heroId).position
    )
    const distance = displacement.distance
    const speedPerTick = glib.speedPerTick(gworld.entities.get(gg.heroId))

    // hide
    if (distance < speedPerTick) {
      position.x = 0
      position.y = 0
      return
    }

    const container = gpixi.getContainer(id)
    if (container) {
      container.children[1].angle += 80 * gpixi.deltaSec
      const scale = 1
      container.scale = { x: 1, y: 0.5 }
      container.scale.x *= scale
      container.scale.y *= scale
      const animationSprite = gpixi.getAnimationSprite(id, "idle")
      if (!animationSprite) return
      animationSprite.blendMode = PIXI.BLEND_MODES.OVERLAY
      animationSprite.alpha = distance / 100
    }
  },
}
