export default {
  position: {},
  sprite: {},

  process(entity, id) {
    let position = entity.position
    if (!position) return

    if (INPUT.lastActiveDevice === "gamepad") {
      position.x = 0
      position.y = 0
      return
    }

    // hold mouse point on cursor while walkable tile isn't found
    // after not walkable tile is proceeded
    if (
      WORLD.loop.elapsedMS <
      WORLD.hero.move.setMousePointOnWalkableMS + 100
    ) {
      const mousePosition = COORDINATES.mousePosition()
      position.x = mousePosition.x
      position.y = mousePosition.y
      const container = SPRITE.getContainer(id)
      if (!container) return

      return
    }

    const finaldestination = WORLD.hero.move.finaldestination
    if (!finaldestination) {
      position.x = 0
      position.y = 0
      return
    }
    position.x = finaldestination.x
    position.y = finaldestination.y

    if (!COORDINATES.isWalkable(position.x, position.y)) {
      position.x = 0
      position.y = 0
    }

    const displacement = COORDINATES.vectorFromPoints(
      position,
      WORLD.entities.get(WORLD.heroId).position
    )
    const distance = displacement.distance
    const speedPerTick = COORDINATES.speedPerTick(
      WORLD.entities.get(WORLD.heroId)
    )

    // hide
    // 📜 change tracked to track state, implement track state
    if (distance < speedPerTick || WORLD.hero.state.track) {
      position.x = 0
      position.y = 0
      return
    }

    const container = SPRITE.getContainer(id)
    const animation = SPRITE.getLayer(id, "animation")

    if (container && animation) {
      animation.angle += 80 * WORLD.loop.deltaSec
      const scale = 1
      container.scale = { x: 1, y: 0.5 }
      container.scale.x *= scale
      container.scale.y *= scale
      const animationSprite = SPRITE.getAnimation(id, "idle")
      if (!animationSprite) return
      animationSprite.blendMode = PIXI.BLEND_MODES.OVERLAY
      setTimeout(() => {
        animationSprite.alpha = distance / 100
      })
    }
  },
}
