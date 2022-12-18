function setAxesAndButtons() {
  if (Gamepad().connected) {
    Gamepad().buttonsCache = Gamepad().buttons

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

export function gamepadListeners() {
  addEventListener("gamepadconnected", () => {
    Gamepad().connected = true
  })
  addEventListener("gamepaddisconnected", () => {
    Gamepad().connected = false
  })
}

export function gamepadUpdate() {
  setAxesAndButtons()

  const buttonsSettings = Object.values(Gamepad().states)
  const states = Object.keys(Gamepad().states)

  // on tap
  buttonsSettings.forEach((buttonSetting, index) => {
    if (
      !buttonSetting[1] &&
      Gamepad().buttons.includes(buttonSetting[0]) &&
      !Gamepad().buttonsCache.includes(buttonSetting[0])
    ) {
      const state = states[index]
      States()[state] = !States()[state]
    }
  })

  // on hold
  buttonsSettings.forEach((buttonSetting, index) => {
    if (buttonSetting[1] && !Gamepad().buttons.includes(buttonSetting[0])) {
      const state = states[index]
      States()[state] = false
    } else if (
      buttonSetting[1] &&
      Gamepad().buttons.includes(buttonSetting[0])
    ) {
      const state = states[index]
      States()[state] = true
    }
  })
}
