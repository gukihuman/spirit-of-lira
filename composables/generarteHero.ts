export function generateHero(breed, X, Y) {
  // copy default breed
  const hero = JSON.parse(JSON.stringify(Breed()[breed]))
  hero.breed = breed

  hero.X = X
  hero.Y = Y
  hero.x = hero.X + Map().offset[0]
  hero.y = hero.Y + Map().offset[1]

  hero.state = "idle"
  hero.stateStartFrame = Frame().current
  hero.animState = "idle"
  hero.animStateStartFrame = Frame().current
  hero.mirrored = false
  hero.health = hero.maxHealth
  hero.mana = hero.maxMana
  Entity().hero = hero
}
