function setKeys() {
  Keyboard().buttonsCache = Keyboard().buttons

  // Listeners
  // const pressed: string[] = []
  // gamepadRaw?.buttons.forEach((button, index) => {
  //   if (button.pressed) {
  //     pressed.push(Pad().buttonList[index])
  //   }
  // })
  // Keyboard().buttons = pressed
}
export function keyUpdate() {
  setKeys()

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
