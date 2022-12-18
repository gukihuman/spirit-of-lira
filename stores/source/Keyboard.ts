export const Keyboard = defineStore("keyboard", {
  state: () => ({
    states: {
      dev: "o",
      pause: "p",
      mapEdit: "m",
      ranges: "r",
    },
    fullscreen: "f",
  }),
})
