export const Gamepad = defineStore("gamepad", {
  state: () => ({
    // controlled by @/composables/gamepadAPI
    connected: false,
    buttons: [],
    axes: [0, 0, 0, 0],
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
  }),
})
