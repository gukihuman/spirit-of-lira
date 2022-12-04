export function canvasGenerate() {
  useCanvasStore().entities.push({
    breed: "hero",
    x: 100,
    y: 100,
    mirrored: false,
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
