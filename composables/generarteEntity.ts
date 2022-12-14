export function generateEntity(breed, X, Y) {
  // copy default breed
  const entity = JSON.parse(JSON.stringify(Breed()[breed]))
  entity.breed = breed

  generateEntityId(entity)

  let mapOffset = Map().mapOffset
  const animBreed = Animation().breeds[breed]
  entity.X = X
  entity.Y = Y
  entity.x = entity.X + mapOffset[0]
  entity.y = entity.Y + mapOffset[1]

  entity.state = "idle"
  entity.stateStartFrame = Frame().current
  entity.animState = "idle"
  entity.animStateStartFrame = Frame().current
  entity.mirrored = false
  entity.health = entity.maxHealth
  entity.mana = entity.maxMana
  Entity().entities.push(entity)
}
