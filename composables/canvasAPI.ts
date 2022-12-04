export function canvasGenerate() {
  useCanvasStore().entities.push({
    breed: "hero",
    state: "idle",
    stateStartFrame: 0,
    x: 960,
    y: 540,
    mirrored: true,
  });
}
export function canvasClear() {
  useCanvasStore().entities = [];
  useCanvasStore().context.clearRect(
    0,
    0,
    useCommonStore().mainWindow.width,
    useCommonStore().mainWindow.height
  );
}
