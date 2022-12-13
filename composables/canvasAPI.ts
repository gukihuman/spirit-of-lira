export function canvasGenerate() {
  entityStore().entities.forEach((entity) => {
    let mapOffset = mapStore().mapOffset;
    entity.x = entity.X - 1 * mapOffset[0];
    entity.y = entity.Y - 1 * mapOffset[1];
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
