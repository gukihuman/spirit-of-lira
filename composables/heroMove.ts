export function heroMove() {
  let speed = hero().speed * 10
  let moved = false

  // LS x
  if (
    Gamepad().axes[0] <= -1 * Settings().deadZone ||
    Gamepad().axes[0] >= Settings().deadZone
  ) {
    hero().x += (speed / 60) * Gamepad().axes[0]
    moved = true
  }

  // LS y
  if (
    Gamepad().axes[1] <= -1 * Settings().deadZone ||
    Gamepad().axes[1] >= Settings().deadZone
  ) {
    hero().y += (speed / 60) * Gamepad().axes[1]
    moved = true
  }
}
