export function gamepadListeners() {
  addEventListener("gamepadconnected", () => {
    Gamepad().connected = true
  })
  addEventListener("gamepaddisconnected", () => {
    Gamepad().connected = false
  })
}

export function gamepadUpdate() {
  if (Gamepad().connected) {
    const gamepadRaw = navigator.getGamepads()[0] || {}
    const pressed = []
    gamepadRaw.buttons.forEach((button, index) => {
      if (button.pressed) {
        pressed.push(Gamepad().buttonList[index])
      }
    })
    const axes = []
    gamepadRaw.axes.forEach((axis) => {
      axes.push(Number(axis.toFixed(2)))
    })
    Gamepad().axes = axes
    Gamepad().buttons = pressed
  }
}
