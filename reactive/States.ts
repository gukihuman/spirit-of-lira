const rawStates = {
  devAccess: false,
  overwriteDataAllowed: false,
  cursor: true,
  allLoaded: false,
  fullscreen: false,
  autoHeroMove: false,

  // UI states
  collisionEdit: false,
}

// 📜
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
