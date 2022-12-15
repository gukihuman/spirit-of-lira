export function canvasGenerate() {
  let hero = Entity().hero
  hero.x = hero.X - 1 * Map().offset[0]
  hero.y = hero.Y - 1 * Map().offset[1]
  Canvas().entities.push(hero)

  Entity().enemy.forEach((enemy) => {
    enemy.x = enemy.X - 1 * Map().offset[0]
    enemy.y = enemy.Y - 1 * Map().offset[1]
    Canvas().entities.push(enemy)
  })
  Canvas().entities.sort((a, b) => a.y - b.y)
}
export function canvasClear() {
  Canvas().entities = []
  Canvas().context.clearRect(0, 0, Canvas().width, Canvas().height)
}
