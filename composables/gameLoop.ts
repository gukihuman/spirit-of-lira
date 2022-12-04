export function gameLoop() {
  setInterval(() => {
    if (!useCommonStore().componentStates.pause) {
      useCommonStore().gameFrame++;
      gamepadUpdate();
      canvasClear();
      canvasGenerate();
    }
  }, 1000 / useSettingsStore().frameRate);
}
