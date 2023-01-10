const rawStates = {
  // dev
  devAccess: false,
  overwriteDataAllowed: false,
  allLoaded: false,
  collisionEdit: false,

  // UI states
  fullscreen: false,
  cursor: true,

  heroMove: false,
}
export const statesList = l.keys(rawStates)

// 📜 cool syntax for type out of keys
// declare global {
//   type States = keyof typeof rawStates
// }

export const States: any = defineStore("states", () => {
  const state = l.mapValues(rawStates, (key) => ref(key))

  watch(state.fullscreen, () => {
    if (!document.fullscreenElement) {
      Refs().background.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  })
  return state
})
