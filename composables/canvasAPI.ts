export function canvasGenerate() {
  entityStore().entities.forEach((entity) => {
    let mapOffset = commonStore().mapOffset;
    entity.x = Number(entity.X - (1 * mapOffset[0]) / scale()).toFixed();
    entity.y = Number(entity.Y - (1 * mapOffset[1]) / scale()).toFixed();
    canvasStore().entities.push(entity);
  });
  canvasStore().entities.sort((a, b) => a.y - b.y);
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
