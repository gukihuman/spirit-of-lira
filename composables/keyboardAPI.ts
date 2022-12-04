export function keyboardListeners() {
  addEventListener("keypress", (event) => {
    // componentStates
    const keys = Object.values(useKeyboardStore().componentStates);
    const states = Object.keys(useKeyboardStore().componentStates);
    keys.forEach((key, index) => {
      if (event.key == key) {
        const state = states[index];
        useCommonStore().componentStates[state] =
          !useCommonStore().componentStates[state];
      }
    });

    // fullscreen
    if (event.key == useKeyboardStore().fullscreen) {
      toggleFullscreen();
    }
  });
}
