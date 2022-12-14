import { Gamepad } from "../stores/generated/Gamepad"
import { Common } from "../stores/Common"
export function mouseListener() {
  addEventListener("mousemove", (event) => {
    Common().states.cursor = true
    Mouse().x = event.clientX
    Mouse().y = event.clientY
  })
}

export function isMousePositionChanged() {
  if (Mouse().x == Mouse().prevX && Mouse().y == Mouse().prevY) {
    Mouse().prevX = Mouse().x
    Mouse().prevY = Mouse().y
    return false
  } else {
    Mouse().prevX = Mouse().x
    Mouse().prevY = Mouse().y
    return true
  }
}

export function mouseLoop() {
  setInterval(() => {
    if (!isMousePositionChanged() && Gamepad().connected) {
      Common().states.cursor = false
    }
  }, 4000)
}
