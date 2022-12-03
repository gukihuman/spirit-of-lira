export const useGamepadStore = defineStore("gamepad", {
  state: () => ({
    // controlled by @/composables/gamepadAPI
    connected: false,
    buttonsStatus: [],
    axesStatus: [],
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
