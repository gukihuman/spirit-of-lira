export default {
  position: {},
  sprite: {},

  process(entity, id) {
    let position = entity.position
    if (!position) return

    if (INPUT.lastActiveDevice === "gamepad" || !WORLD.hoverId) {
      position.x = 0
      position.y = 0
      return
    }

    position.x = COORDINATES.mousePosition().x
    position.y = COORDINATES.mousePosition().y
  },
}
