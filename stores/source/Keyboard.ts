export const Keyboard = defineStore("keyboard", {
  state: () => ({
    states: {
      dev: "o",
      pause: "p",
      mapEdit: "m",
      ranges: "r",
      gamepad: "g",
    },
    fullscreen: "f",
  }),
})
