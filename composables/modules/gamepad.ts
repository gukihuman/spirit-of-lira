function setAxesAndButtons() {
  if (Pad().connected) {
    Pad().buttonsCache = Pad().buttons

    const gamepadRaw = navigator.getGamepads()[0] || undefined
    const pressed: string[] = []
    gamepadRaw?.buttons.forEach((button, index) => {
      if (button.pressed) {
        pressed.push(Pad().buttonList[index])
      }
    })
    const axes: number[] = []
    gamepadRaw?.axes.forEach((axis) => {
      axes.push(Number(axis.toFixed(2)))
    })
    Pad().axes = axes
    Pad().buttons = pressed
  }
}
export function watchGamepadConnection() {
  addEventListener("gamepadconnected", () => {
    Pad().connected = true
  })
  addEventListener("gamepaddisconnected", () => {
    Pad().connected = false
  })
}
export function gamepadUpdate() {
  setAxesAndButtons()

  // 📜 ui states control
  // const buttonsSettings = Object.values(Pad().states)
  // const states = Object.keys(Pad().states)

  // // on tap
  // buttonsSettings.forEach((buttonSetting: any, index) => {
  //   if (
  //     !buttonSetting[1] &&
  //     Pad().buttons.includes(buttonSetting[0]) &&
  //     !Pad().buttonsCache.includes(buttonSetting[0])
  //   ) {
  //     const state = states[index]
  //     States()[state] = !States()[state]
  //   }
  // })

  // // on hold
  // buttonsSettings.forEach((buttonSetting: any, index) => {
  //   if (buttonSetting[1] && !Pad().buttons.includes(buttonSetting[0])) {
  //     const state = states[index]
  //     States()[state] = false
  //   } else if (buttonSetting[1] && Pad().buttons.includes(buttonSetting[0])) {
  //     const state = states[index]
  //     States()[state] = true
  //   }
  // })
}
