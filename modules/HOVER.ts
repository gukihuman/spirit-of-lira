class Hover {
  process() {
    if (INPUT.lastActiveDevice === "gamepad") return
    const point = COORDINATES.mouseOfScreen()
    const heroPosition = WORLD.hero.position
    const intersections: number[] = []
    let hoverEntityId = 0
    WORLD.entities.forEach((entity, id) => {
      if (id === WORLD.heroId || !entity.move || !entity.size) return
      // how much height goes under the y coordinate
      let offset = entity.size.width / 4
      const position = entity.position
      const rect = {
        x:
          position.x -
          heroPosition.x +
          CONFIG.viewport.width / 2 -
          entity.size.width / 2,
        y:
          position.y -
          heroPosition.y +
          CONFIG.viewport.height / 2 -
          entity.size.height +
          offset,
        width: entity.size.width,
        height: entity.size.height,
      }
      const intersectX = point.x < rect.x + rect.width && point.x > rect.x
      const intersectY = point.y < rect.y + rect.height && point.y > rect.y
      if (intersectX && intersectY && entity.state.active !== "dead")
        intersections.push(id)
    })
    // in case there is more than one entity under the mouse
    if (intersections.length > 1) {
      let higherY = 0
      intersections.forEach((id) => {
        if (WORLD.entities.get(id).position.y > higherY) {
          higherY = WORLD.entities.get(id).position.y
          hoverEntityId = id
        }
      })
    } else if (intersections.length === 1) {
      hoverEntityId = intersections[0]
    }
    GLOBAL.hoverId = hoverEntityId
    WORLD.hover = WORLD.entities.get(hoverEntityId)
  }
}
export const HOVER = new Hover()
