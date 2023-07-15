export default {
  position: {},
  sprite: { parent: "ground", initial: { randomFlip: false } },

  process(entity, id) {
    let position = entity.position
    if (!position) return

    const destination = SYSTEM_DATA.world.hero.move.destination
    if (!destination) {
      position.x = 0
      position.y = 0
      return
    }
    position.x = destination.x
    position.y = destination.y

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
