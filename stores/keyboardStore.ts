export const keyboardStore = defineStore("keyboard", {
  state: () => ({
    uiStates: {
      dev: "u",
      pause: "p",
      ranges: "o",
    },
    fullscreen: ",",
  }),
});
