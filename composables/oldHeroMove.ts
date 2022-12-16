export function oldHeroMove() {
  let hero = OldEntity().hero
  let speed = hero.speed * 10
  let moved = false

  // LS x
  if (
    Gamepad().axes[0] <= -1 * Settings().deadZone ||
    Gamepad().axes[0] >= Settings().deadZone
  ) {
    let changeX = (speed / 60) * Gamepad().axes[0]
    hero.X += Number(changeX.toFixed(2))
    hero.state = "walk"
    hero.animState = "walk"
    moved = true
    if (Gamepad().axes[0] <= 0) {
      hero.mirrored = true
    } else {
      hero.mirrored = false
    }
    Animation().idleAnim = false
  }

  // LS y
  if (
    Gamepad().axes[1] <= -1 * Settings().deadZone ||
    Gamepad().axes[1] >= Settings().deadZone
  ) {
    let changeY = (speed / 60) * Gamepad().axes[1]
    hero.Y += Number(changeY.toFixed(2))
    hero.state = "walk"
    hero.animState = "walk"
    moved = true
    Animation().idleAnim = false
  }

  if (!moved) {
    hero.state = "idle"
    Animation().idleAnim = true
  }

  Map().offset[0] = hero.X - 960
  Map().offset[1] = hero.Y - 540
}
