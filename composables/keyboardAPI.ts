export function keyboardListeners() {
  addEventListener("keypress", (event) => {
    // states
    const keys = Object.values(keyboardStore().states);
    const states = Object.keys(keyboardStore().states);
    keys.forEach((key, index) => {
      if (event.key == key) {
        const state = states[index];
        commonStore().states[state] = !commonStore().states[state];
      }
    });

    // fullscreen
    if (event.key == keyboardStore().fullscreen) {
      toggleFullscreen();
    }
  });
}
