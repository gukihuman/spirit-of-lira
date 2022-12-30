const rawStates = {
  // devAccess: false,
  // updateAllowed: false,
}
declare global {
  type UiStates = keyof typeof rawStates
}

export const UiStates = defineStore("states", () => {
  const state = l.mapValues(rawStates, (state) => ref(state))

  // watch(state.dev, (dev) => {
  //   localStorage.setItem("dev", l.toString(dev))
  // })

  return state
})
