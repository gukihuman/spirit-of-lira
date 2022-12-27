export const States = defineStore("states", () => {
  // controlled by @/composables/keyboardAPI and others
  const rawState = {
    dev: false,
    pause: false,
    ranges: false,
    cursor: true,
    mapEdit: false,
    mainWindow: true,
    bobcat: false,
    updateAllowed: false,
    gamepad: true,
    mouseScreen: false,
    mouseMove: false,
  }

  const state = l.mapValues(rawState, (state) => ref(state))

  watch(state.dev, (dev) => {
    localStorage.setItem("dev", l.toString(dev))
  })

  return state
})
