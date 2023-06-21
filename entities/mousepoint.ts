export default {
  position: {},
  visual: { parent: "ground" },

  process(entity, id) {
    let position = entity.position
    if (!position) return

    const destination = GLOBAL.hero.move.destination
    if (!destination) {
      position.x = 0
      position.y = 0
      return
    }
    position.x = destination.x
    position.y = destination.y

    const displacement = LIB.vectorFromPoints(
      position,
      WORLD.entities.get(GLOBAL.heroId).position
    )
    const distance = displacement.distance
    const speedPerTick = LIB.speedPerTick(WORLD.entities.get(GLOBAL.heroId))

    // hide
    if (distance < speedPerTick || GLOBAL.hero.target.attacked) {
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
