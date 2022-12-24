export function gameLoop() {
  setInterval(() => {
    gamepadUpdate()
    mouseUpdate()
    if (!States().pause) {
      Canvas().context.clearRect(0, 0, Canvas().width, Canvas().height)
      clearHeroTarget()
      Game().frame++
      Game().entities.forEach((entity) => {
        entity.setTarget()
        entity.setNextXY()
        entity.move()
      })
      stateManager() // must be after heroMove because of new coordinates
      setCamera()
      Game().entities.sort((a, b) => a.y - b.y)
      States().mapEdit && States().bobcat ? mapEdit() : {}
      Game().frame % 60 == 0 ? updateGameData() : {}
    }
  }, 1000 / 60)
}
