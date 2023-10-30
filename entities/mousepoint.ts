export default {
  position: {
    x: -30,
    y: -30,
  },
  sprite: {},

  process(entity: { position: any }, id: number) {
    let position = entity.position
    if (!position) return

    if (GLOBAL.lastActiveDevice === "gamepad") {
      position.x = -30
      position.y = -30
      return
    }

    const finaldestination = WORLD.hero.move.finaldestination
    if (!finaldestination) {
      position.x = -30
      position.y = -30
      return
    }
    position.x = finaldestination.x
    position.y = finaldestination.y

    if (!COORD.isWalkable(position.x, position.y)) {
      position.x = -30
      position.y = -30
    }

    const displacement = COORD.vectorFromPoints(
      position,
      WORLD.entities.get(WORLD.heroId).position
    )
    const distance = displacement.distance
    const speedPerTick = COORD.speedPerTick(WORLD.entities.get(WORLD.heroId))

    // hide
    // 📜 change tracked to track state, implement track state
    if (distance < speedPerTick || WORLD.hero.state.track) {
      position.x = -30
      position.y = -30
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
