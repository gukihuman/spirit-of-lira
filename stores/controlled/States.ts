export const States = defineStore("states", {
  state: () => ({
    // controlled by @/composables/keyboardAPI and others
    dev: true,
    pause: false,
    ranges: false,
    cursor: true,
    mapEdit: false,
    mainWindow: true,
    bobcat: false,
    updateAllowed: false,
    gamepad: true,
  }),
})
