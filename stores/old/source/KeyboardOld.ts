export const KeyboardOld = defineStore("keyboard", {
  state: () => ({
    states: {
      dev: "o",
      pause: "p",
      mapEdit: "m",
      ranges: "r",
      gamepad: "g",
      mouseScreen: "c",
    },
    fullscreen: "f",
  }),
})
