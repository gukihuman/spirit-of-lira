export const gamepadStore = defineStore("gamepad", {
  state: () => ({
    // controlled by @/composables/gamepadAPI
    connected: false,
    buttonsStatus: [],
    axesStatus: [0, 0, 0, 0],
    buttons: [
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
});
