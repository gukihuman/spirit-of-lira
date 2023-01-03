const rawStates = {
  devAccess: false,
  overwriteDataAllowed: false,
  cursor: true,
  allLoaded: false,
  mouseMoving: false,
  fullscreen: false,
  autoHeroMove: false,
}
// declare global {
//   type States = keyof typeof rawStates
// }

export const States = defineStore("states", () => {
  const state = l.mapValues(rawStates, (state) => ref(state))

  watch(state.fullscreen, () => {
    if (!document.fullscreenElement) {
      Refs().background.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  })

  return state
})
