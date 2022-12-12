export const commonStore = defineStore("common", {
  state: () => ({
    // controlled by @/composables/mainWindowUpdate
    mainWindow: {
      width: 0,
      height: 0,
      scale: 1,
    },
    // controlled by @/composables/gameLoop
    gameFrame: 0,

    // controlled by @/composables/keyboardAPI and others
    states: {
      dev: true,
      pause: false,
      ranges: true,
      cursor: true,
    },

    // controlled by @/composables/mapAPI
    mapOffset: [0, 0],
  }),
});
