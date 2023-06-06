export default {
  name: "mousepoint",
  visual: { parentContainer: "ground" },
  process(entity, id) {
    let position = entity.position
    if (!position) return

    const targetPosition = GLOBAL.hero.alive.targetPosition
    if (!targetPosition) {
      position.x = 0
      position.y = 0
      return
    }
    position.x = targetPosition.x
    position.y = targetPosition.y

    const displacement = LIB.vectorFromPoints(
      position,
      WORLD.entities.get(GLOBAL.heroId).position
    )
    const distance = displacement.distance
    const speedPerTick = LIB.speedPerTick(WORLD.entities.get(GLOBAL.heroId))

    // hide
    if (distance < speedPerTick || GLOBAL.hero.alive.targetAttacked) {
      position.x = 0
      position.y = 0
      return
    }

    const container = PIXI_GUKI.getContainer(id)
    if (container) {
      container.children[1].angle += 80 * PIXI_GUKI.deltaSec
      const scale = 1
      container.scale = { x: 1, y: 0.5 }
      container.scale.x *= scale
      container.scale.y *= scale
      const animationSprite = PIXI_GUKI.getAnimationSprite(id, "idle")
      if (!animationSprite) return
      animationSprite.blendMode = PIXI.BLEND_MODES.OVERLAY
      animationSprite.alpha = distance / 100
    }
  },
}
