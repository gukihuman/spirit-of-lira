export function gameLoop() {
  setInterval(() => {
    if (!States().pause) {
      Frame().current++
      gamepadUpdate()
      heroMove()
      Animation().idleAnim ? idleAnim() : {}
      canvasClear()
      canvasGenerate()
      States().mapEdit && States().bobcat ? mapEditUpdate() : {}
      Frame().current % 60 == 0 ? updateGameData() : {}
    }
  }, 1000 / 60)
}
