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

// 📜 cool syntax for type out of keys
// declare global {
//   type States = keyof typeof rawStates
// }

export const States: any = defineStore("states", () => {
  const state = l.mapValues(rawStates, (key) => ref(key))

  watch(state.fullscreen, () => {
    if (!document.fullscreenElement) {
      ggm.refs.background.requestFullscreen()
    } else if (document.exitFullscreen) {
      document.exitFullscreen()
    }
  })
  watch(state.collisionEdit, (newValue) => {
    if (newValue) pixi.collision.visible = true
    else pixi.collision.visible = false
  })
  return state
})
