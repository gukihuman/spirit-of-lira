export function canvasGenerate() {
  Entity().entities.forEach((entity) => {
    let mapOffset = Map().mapOffset
    entity.x = entity.X - 1 * mapOffset[0]
    entity.y = entity.Y - 1 * mapOffset[1]
    Canvas().entities.push(entity)
  })
  Canvas().entities.sort((a, b) => a.y - b.y)
}
export function canvasClear() {
  Canvas().entities = []
  Canvas().context.clearRect(0, 0, Canvas().width, Canvas().height)
}
