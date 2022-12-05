export function gameLoop() {
  setInterval(() => {
    if (!commonStore().uiStates.pause) {
      commonStore().gameFrame++;
      gamepadUpdate();
      canvasClear();
      canvasGenerate();
    }
  }, 1000 / settingsStore().frameRate);
}
