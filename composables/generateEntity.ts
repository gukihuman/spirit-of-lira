export function generateEntity(name, x, y) {
  const entity = {}

  // fill with prime parameters
  Object.keys(EntityInfo()[name]).forEach((key) => {
    entity[key] = EntityInfo()[name][key]
  })

  Game().id++
  entity.id = Game().id
  entity.name = name
  entity.x = x
  entity.y = y
  entity.prevX = x
  entity.prevY = y
  entity.status = "idle"
  entity.statusFrame = Frame().current
  entity.anim = "idle"
  entity.animFrame = Frame().current
  entity.mirrored = false

  Game().entities.push(entity)
}
