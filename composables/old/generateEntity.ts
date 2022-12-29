export function generateEntity(name, x, y) {
  const entity = {}

  // fill with prime parameters
  Object.keys(CreatureInfo()[name]).forEach((key) => {
    entity[key] = CreatureInfo()[name][key]
  })

  Game().freeId++
  entity.id = Game().freeId
  entity.name = name
  entity.x = x
  entity.y = y
  entity.prevX = x
  entity.prevY = y
  entity.state = "idle"
  entity.stateFrame = Game().frame
  entity.mirrored = false
  entity.targetId = undefined
  entity.targetDistance = undefined

  Game().entities.push(entity)
}
