export function canvasGenerate() {
  entityStore().entities.forEach((entity) => {
    canvasStore().entities.push(entity);
  });
}
export function canvasClear() {
  canvasStore().entities = [];
  canvasStore().context.clearRect(
    0,
    0,
    canvasStore().width,
    canvasStore().height
  );
}
