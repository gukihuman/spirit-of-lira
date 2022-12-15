export function generateEnemy(breed, X, Y) {
  // copy default breed
  const enemy = JSON.parse(JSON.stringify(Breed()[breed]))
  enemy.breed = breed

  enemy.id = Object.keys(Entity().enemy).length

  const animBreed = Animation().breeds[breed]
  enemy.X = X
  enemy.Y = Y
  enemy.x = enemy.X + Map().offset[0]
  enemy.y = enemy.Y + Map().offset[1]

  enemy.state = "idle"
  enemy.stateStartFrame = Frame().current
  enemy.animState = "idle"
  enemy.animStateStartFrame = Frame().current
  enemy.mirrored = false
  enemy.health = enemy.maxHealth
  enemy.mana = enemy.maxMana
  Entity().enemy.push(enemy)
}
