export const keyboardStore = defineStore("keyboard", {
  state: () => ({
    states: {
      dev: "u",
      pause: "p",
      ranges: "o",
      mouse: "m",
    },
    fullscreen: ",",
  }),
});
