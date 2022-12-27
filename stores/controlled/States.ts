const rawStates = {
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
export type StatesType = keyof typeof rawStates

export const States = defineStore("states", () => {
  const state = l.mapValues(rawStates, (state) => ref(state))

  watch(state.dev, (dev) => {
    localStorage.setItem("dev", l.toString(dev))
  })

  return state
})
