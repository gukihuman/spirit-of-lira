export function movement() {
  let deadZone = Settings().gamepadDeadZone
  let axes = Gamepad().axesStatus
  let speed = Entity().entities[0].speed * 10
  let mapOffset = Map().mapOffset
  let framerate = Settings().framerate
  let hero = Entity().entities.find((i) => i.id == 0)

  let moved = false

  // LS x
  if (axes[0] <= -1 * deadZone || axes[0] >= deadZone) {
    let changeX = (speed / framerate) * axes[0]
    hero.X += Number(changeX.toFixed(2))
    hero.state = "walk"
    hero.animState = "walk"
    moved = true
    if (axes[0] <= 0) {
      hero.mirrored = true
    } else {
      hero.mirrored = false
    }
    Animation().idleAnim = false
    // if (axes[0] <= -0.5 || axes[0] >= 0.5) {
    //   hero.state = "run";
    //   hero.animState = "run";
    // }
  }

  // LS y
  if (axes[1] <= -1 * deadZone || axes[1] >= deadZone) {
    let changeY = (speed / framerate) * axes[1]
    hero.Y += Number(changeY.toFixed(2))
    hero.state = "walk"
    hero.animState = "walk"
    moved = true
    Animation().idleAnim = false
    // if (axes[1] <= -0.5 || axes[1] >= 0.5) {
    //   hero.state = "run";
    //   hero.animState = "run";
    // }
  }

  if (!moved) {
    hero.state = "idle"
    Animation().idleAnim = true
  }

  mapOffset[0] = hero.X - 960
  mapOffset[1] = hero.Y - 540
}
