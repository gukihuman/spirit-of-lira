export function gameLoop() {
  setInterval(() => {
    if (!States().pause) {
      Canvas().context.clearRect(0, 0, Canvas().width, Canvas().height)
      Frame().current++
      gamepadUpdate()
      heroMove()
      statusManager() // must be after heroMove because of new coordinates
      animManager()
      setCamera() // must be after heroMove because of new coordinates
      Game().entities.sort((a, b) => a.y - b.y)
      States().mapEdit && States().bobcat ? mapEdit() : {}
      Frame().current % 60 == 0 ? updateGameData() : {}
    }
  }, 1000 / 60)
}
