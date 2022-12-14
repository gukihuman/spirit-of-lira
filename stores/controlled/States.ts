export const States = defineStore("states", {
  state: () => ({
    // controlled by @/composables/keyboardAPI and others
    dev: true,
    pause: false,
    ranges: true,
    cursor: true,
    mapEdit: false,
    mainWindow: false,
  }),
})
