export function idleAnim() {
  let hero = Entity().entities.find((i) => i.id == 0)
  let framerate = Settings().framerate
  let switchFrames = Animation().switchFrames

  if (
    hero.animState != "idle" &&
    hero.animState != "idleB" &&
    hero.animState != "switchIdleIdleB" &&
    hero.animState != "switchIdleBIdle"
  ) {
    hero.animState = "idle"
  }

  if (Frame().current == switchFrames.idleIdleB) {
    hero.animStateStartFrame = Frame().current
    hero.animState = "idleB"
  }
  if (
    Frame().current % framerate == 0 &&
    Math.random() < 0.15 &&
    hero.state == "idle" &&
    hero.animState === "idle" &&
    Frame().current >= hero.animStateStartFrame + framerate * 2
  ) {
    hero.animState = "switchIdleIdleB"
    hero.animStateStartFrame = Frame().current
    switchFrames.idleIdleB = Frame().current + framerate
  }

  if (Frame().current == switchFrames.idleBIdle) {
    hero.animStateStartFrame = Frame().current
    hero.animState = "idle"
  }
  if (
    Frame().current % framerate == 0 &&
    Math.random() < 0.1 &&
    hero.state == "idle" &&
    hero.animState === "idleB" &&
    Frame().current >= hero.animStateStartFrame + framerate * 2
  ) {
    hero.animState = "switchIdleBIdle"
    hero.animStateStartFrame = Frame().current
    switchFrames.idleBIdle = Frame().current + framerate
  }
}
