export function mouseListener() {
  Ref().mouseScreen.addEventListener("mousemove", (event) => {
    States().cursor = true
    Mouse().offsetX = event.offsetX
    Mouse().offsetY = event.offsetY
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

export function mouseUpdate() {
  Mouse().x = Mouse().offsetX + Map().offset[0]
  Mouse().y = Mouse().offsetY + Map().offset[1]
}

export function mouseLoop() {
  setInterval(() => {
    if (!isMousePositionChanged() && Gamepad().connected) {
      States().cursor = false
    }
  }, 4000)
}
