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
export function padUpdate() {
  setAxesAndButtons()

  const settingButtons = Object.values(User().data.settings.control.gamepad)
  const states = Object.keys(User().data.settings.control.gamepad)

  // on tap
  settingButtons.forEach((settingButton: any, index) => {
    if (
      Pad().buttons.includes(settingButton) &&
      !Pad().buttonsCache.includes(settingButton)
    ) {
      const state = states[index]
      States()[state] = !States()[state]
    }
  })

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
