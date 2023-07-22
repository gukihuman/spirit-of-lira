export default {
  position: {},
  sprite: { parent: "ground", initial: { randomFlip: false } },

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
      STATES.hero.move.setMousePointOnWalkableMS + 100
    ) {
      const mousePosition = COORDINATES.mousePosition()
      position.x = mousePosition.x
      position.y = mousePosition.y
      const container = WORLD.getContainer(id)
      if (!container) return

      // 📜 add to preload filters
      // container.filters = [
      //   new PIXI_FILTERS.AdjustmentFilter({
      //     red: 1.4,
      //     saturation: 0.9,
      //     brightness: 0.7,
      //   }),
      // ]
      // container.filters = [
      //   new PIXI_FILTERS.HslAdjustmentFilter({
      //     hue: 20,
      //     lightness: 0.3,
      //   }),
      // ]
      // setTimeout(() => {
      //   container.filters = []
      // }, 0)
      return
    }

    const finaldestination = STATES.hero.move.finaldestination
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
      WORLD.entities.get(STATES.heroId).position
    )
    const distance = displacement.distance
    const speedPerTick = LIB.speedPerTick(WORLD.entities.get(STATES.heroId))

    // hide
    if (distance < speedPerTick || STATES.hero.target.attacked) {
      position.x = 0
      position.y = 0
      return
    }

    const main = WORLD.getContainer(id)
    const middle = WORLD.getLayer(id, "middle")

    if (main && middle) {
      middle.angle += 80 * WORLD.loop.deltaSec
      const scale = 1
      main.scale = { x: 1, y: 0.5 }
      main.scale.x *= scale
      main.scale.y *= scale
      const animationSprite = WORLD.getSprite(id, "idle")
      if (!animationSprite) return
      animationSprite.blendMode = PIXI.BLEND_MODES.OVERLAY
      setTimeout(() => {
        animationSprite.alpha = distance / 100
      })
    }
  },
}
