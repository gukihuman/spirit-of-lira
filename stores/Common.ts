export const Common = defineStore("common", {
  state: () => ({
    // controlled by @/composables/mainWindowUpdate
    mainWindow: {
      width: 0,
      height: 0,
      scale: 1,
    },

    // controlled by @/composables/keyboardAPI and others
    states: {
      dev: true,
      pause: false,
      ranges: true,
      cursor: true,
      mapEdit: false,
    },

    refs: {
      // controlled by @/app
      background: null,
    },
  }),
})
