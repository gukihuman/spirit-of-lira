export const keyboardStore = defineStore("keyboard", {
  state: () => ({
    states: {
      dev: "o",
      pause: "p",
      ranges: "r",
      mapEdit: "m",
    },
    fullscreen: "f",
  }),
});
