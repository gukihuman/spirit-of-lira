export const useKeyboardStore = defineStore("keyboard", {
  state: () => ({
    componentStates: {
      dev: "u",
      pause: "p",
    },
    fullscreen: ",",
  }),
});
