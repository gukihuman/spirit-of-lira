export function keyboardListeners() {
  addEventListener("keypress", (event) => {
    // states
    const keys = Object.values(Keyboard().states)
    const states = Object.keys(Keyboard().states)
    keys.forEach((key, index) => {
      if (event.key == key) {
        const state = states[index]
        States()[state] = !States()[state]
      }
    })

    // fullscreen
    if (event.key == Keyboard().fullscreen) {
      toggleFullscreen()
    }
  })
}
