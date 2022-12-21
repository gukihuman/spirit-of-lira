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
  entity.state = "idle"
  entity.stateFrame = Game().frame
  entity.anim = "idle"
  entity.animFrame = Game().frame
  entity.mirrored = false
  entity.targetId = undefined
  entity.targetDistance = undefined

  Game().entities.push(entity)
}
