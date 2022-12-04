export const useCommonStore = defineStore("common", {
  state: () => ({
    // controlled by @/composables/mainWindowUpdate
    mainWindow: {
      width: 800,
      height: 450,
      scale: 1,
    },
    // controlled by @/app
    gameFrame: 0,

    // controlled by @/composables/keyboardAPI
    componentStates: {
      dev: false,
      pause: false,
    },
  }),
});
