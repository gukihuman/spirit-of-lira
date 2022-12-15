export function mouseListener() {
  addEventListener("mousemove", (event) => {
    States().cursor = true
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
      States().cursor = false
    }
  }, 4000)
}
