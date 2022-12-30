interface State {
  readonly buttonList: string[]
  connected: boolean
  buttons: string[]
  buttonsCache: string[]
  axes: number[]
}

export const Pad = defineStore("gamepad", {
  state: (): State => ({
    buttonList: [
      "A",
      "B",
      "X",
      "Y",
      "LB",
      "RB",
      "LT",
      "RT",
      "Start",
      "Menu",
      "LS",
      "RS",
      "Up",
      "Down",
      "Left",
      "Right",
    ],
    connected: false,
    buttons: [],
    buttonsCache: [],
    axes: [0, 0, 0, 0],
  }),
})
