interface State {
  [index: string]: any
}
export const Listeners = defineStore("listeners", {
  state: (): State => ({
    resize: l.debounce(() => setViewportSize(), 20),
    padConnect: () => {
      Pad().connected = true
      Listeners()._hideCursor()
      addEventListener("mousemove", Listeners().hideCursor)
      console.log(timeNow() + ` ✅ Pad: connected`)
    },
    padDisconnect: () => {
      Pad().connected = false
      States().cursor = true
      removeEventListener("mousemove", Listeners().hideCursor)
      console.log(timeNow() + ` ❎ Pad: disconnected`)
    },
    _hideCursor: l.debounce(() => (States().cursor = false), 3000),
    hideCursor: () => {
      States().cursor = true
      Listeners()._hideCursor()
    },
  }),
})
