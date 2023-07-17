export default {
  position: {},
  sprite: { parent: "ground", initial: { randomFlip: false } },

  process(entity, id) {
    let position = entity.position
    if (!position) return

    if (
      SYSTEMS.astar &&
      GPIXI.elapsedMS < SYSTEMS.astar.lastClosestTileFoundMS + 100
    ) {
      const mousePosition = LIB.mousePoint()
      mousePosition.x += SYSTEM_DATA.world.hero.position.x - 960
      mousePosition.y += SYSTEM_DATA.world.hero.position.y - 540
      position.x = mousePosition.x
      position.y = mousePosition.y
      return
    }

    const finaldestination = SYSTEM_DATA.world.hero.move.finaldestination
    if (!finaldestination) {
      position.x = 0
      position.y = 0
      return
    }
    position.x = finaldestination.x
    position.y = finaldestination.y

    if (!LIB.isWalkable(position.x, position.y)) {
      position.x = 0
      position.y = 0
    }

    const displacement = LIB.vectorFromPoints(
      position,
      ENTITIES.get(SYSTEM_DATA.world.heroId).position
    )
    const distance = displacement.distance
    const speedPerTick = LIB.speedPerTick(
      ENTITIES.get(SYSTEM_DATA.world.heroId)
    )

    // hide
    if (distance < speedPerTick || SYSTEM_DATA.world.hero.target.attacked) {
      position.x = 0
      position.y = 0
      return
    }

    const main = GPIXI.getMain(id)
    const middle = GPIXI.getMiddle(id)

    if (main && middle) {
      middle.angle += 80 * GPIXI.deltaSec
      const scale = 1
      main.scale = { x: 1, y: 0.5 }
      main.scale.x *= scale
      main.scale.y *= scale
      const animationSprite = GPIXI.getSprite(id, "idle")
      if (!animationSprite) return
      animationSprite.blendMode = PIXI.BLEND_MODES.OVERLAY
      animationSprite.alpha = distance / 100
    }
  },
}
