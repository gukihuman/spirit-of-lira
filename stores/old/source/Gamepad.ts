interface State {
  readonly buttonList: string[]
  connected: boolean
  buttons: string[]
  buttonsCache: string[]
  axes: number[]
  states: {}
}

export const Gamepad = defineStore("gamepad", {
  state: (): State => ({
    // controlled by gamepadAPI
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
    states: {
      ranges: ["LT", true],
      pause: ["Start", false],
    },
  }),
})
