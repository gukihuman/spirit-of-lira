class Hover {
  process() {
    if (GLOBAL.lastActiveDevice === "gamepad") return
    const point = COORD.mouseOfScreen()
    const heroPosition = WORLD.hero.POSITION
    const intersections: number[] = []
    let hoverEntityId = 0
    WORLD.entities.forEach((entity, id) => {
      if (id === WORLD.heroId || !entity.MOVE || !entity.SIZE) return
      const position = entity.POSITION
      const rect = {
        x:
          position.x -
          heroPosition.x +
          CONFIG.viewport.width / 2 -
          entity.SIZE.width / 2,
        y:
          position.y -
          heroPosition.y +
          CONFIG.viewport.height / 2 -
          entity.SIZE.height +
          entity.SIZE.bottom,
        width: entity.SIZE.width,
        height: entity.SIZE.height,
      }
      const intersectX = point.x < rect.x + rect.width && point.x > rect.x
      const intersectY = point.y < rect.y + rect.height && point.y > rect.y
      if (intersectX && intersectY && entity.STATE.active !== "dead")
        intersections.push(id)
    })
    // in case there is more than one entity under the mouse
    if (intersections.length > 1) {
      let higherY = 0
      intersections.forEach((id) => {
        if (WORLD.entities.get(id).POSITION.y > higherY) {
          higherY = WORLD.entities.get(id).POSITION.y
          hoverEntityId = id
        }
      })
    } else if (intersections.length === 1) {
      hoverEntityId = intersections[0]
    }
    if (hoverEntityId) {
      GLOBAL.hoverId = hoverEntityId
      WORLD.hover = WORLD.entities.get(hoverEntityId)
      this.debouncedEmpty()
    }
  }
  debouncedEmpty = _.debounce(() => {
    GLOBAL.hoverId = null
    WORLD.hover = null
  }, 120)
}
export const HOVER = new Hover()
