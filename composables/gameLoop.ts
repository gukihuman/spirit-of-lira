export function gameLoop() {
  setInterval(() => {
    gamepadUpdate()
    if (!States().pause) {
      Canvas().context.clearRect(0, 0, Canvas().width, Canvas().height)
      Frame().current++
      heroMove()
      Frame().current % 15 == 0 ? targetUpdate() : {}
      statusManager() // must be after heroMove because of new coordinates
      setCamera() // must be after heroMove because of new coordinates
      Game().entities.sort((a, b) => a.y - b.y)
      States().mapEdit && States().bobcat ? mapEdit() : {}
      Frame().current % 60 == 0 ? updateGameData() : {}
    }
  }, 1000 / 60)
}
