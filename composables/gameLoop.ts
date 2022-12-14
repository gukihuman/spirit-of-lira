import { mapUpdate } from "./mapAPI"
import { isMousePositionChanged } from "./mouseAPI"
import { movement } from "./movement"

export function gameLoop() {
  setInterval(() => {
    if (!States().pause) {
      Frame().current++
      gamepadUpdate()
      movement()
      Animation().idleAnim ? idleAnim() : {}
      canvasClear()
      canvasGenerate()
      States().mapEdit ? mapEditUpdate() : {}
    }
  }, 1000 / Settings().framerate)
}
