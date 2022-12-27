export function startGameLoop() {
  setInterval(() => {
    const performanceCache = performance.now()

    gameLoop()

    if (Monitor().gameLoop.length > 300) Monitor().gameLoop.shift()
    Monitor().gameLoop.push(performance.now() - performanceCache)
  }, 1000 / 60)
}

function gameLoop(): void {
  if (States().gamepad) gamepadUpdate()
  mouseUpdate()

  if (!States().pause) {
    Canvas().context?.clearRect(0, 0, Canvas().width, Canvas().height)
    clearHeroTarget()
    Game().frame++
    if (Game().frame % 6 === 0) cacheEntities()
    Game().entities.forEach((entity) => {
      entity.setTarget()
      entity.setNextXY()
      entity.move()
    })
    stateManager()
    setCamera()
    Game().entities.sort((a, b) => a.y - b.y)
    if (States().mapEdit && States().bobcat) mapEdit()
    if (Game().frame % 60 == 0) updateGameData()
  }
}
