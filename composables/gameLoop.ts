import { mapUpdate } from "./mapAPI"
import { isMousePositionChanged } from "./mouseAPI"
import { movement } from "./movement"

export function gameLoop() {
  setInterval(() => {
    if (!Common().states.pause) {
      Frame().current++
      gamepadUpdate()
      movement()
      Animation().idleAnim ? idleAnim() : {}
      canvasClear()
      canvasGenerate()
      Common().states.mapEdit ? mapEditUpdate() : {}
    }
  }, 1000 / Settings().framerate)
}
