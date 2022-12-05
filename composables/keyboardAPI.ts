export function keyboardListeners() {
  addEventListener("keypress", (event) => {
    // uiStates
    const keys = Object.values(keyboardStore().uiStates);
    const states = Object.keys(keyboardStore().uiStates);
    keys.forEach((key, index) => {
      if (event.key == key) {
        const state = states[index];
        commonStore().uiStates[state] = !commonStore().uiStates[state];
      }
    });

    // fullscreen
    if (event.key == keyboardStore().fullscreen) {
      toggleFullscreen();
    }
  });
}
