export const usePiniaStore = defineStore("pinia", {
  state: () => ({
    // controlled by @/composables/updateMainWindowStyle
    mainWindowStyle: {
      width: 800,
      height: 450,
      top: 0,
      left: 0,
    },
    // controlled by @/composables/gameLoop
    gameFrame: 0,
  }),
});
