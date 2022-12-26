export function gameLoop() {
  setInterval(() => {
    Performance().startGameLoop = performance.now()
    // Performance().display = Number(localStorage.getItem("performance"))
    // localStorage.setItem("performance", 0)
    if (Game().frame % 2 === 0) Performance().startFrame = performance.now()
    else Performance().endFrame = performance.now()

    if (States().gamepad) gamepadUpdate()
    mouseUpdate()
    if (!States().pause) {
      Canvas().context.clearRect(0, 0, Canvas().width, Canvas().height)
      clearHeroTarget()
      Game().frame++
      if (Game().frame % 6 === 0) cacheEntities()
      Game().entities.forEach((entity) => {
        entity.setTarget()
        entity.setNextXY()
        entity.move()
      })
      stateManager() // must be after heroMove because of new coordinates
      setCamera()
      Game().entities.sort((a, b) => a.y - b.y)
      if (States().mapEdit && States().bobcat) mapEdit()
      if (Game().frame % 60 == 0) updateGameData()
    }

    Performance().endGameLoop = performance.now()
  }, 1000 / 60)
}
