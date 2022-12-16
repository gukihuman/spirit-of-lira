export function idleAnim() {
  let framerate = 60
  let switchFrames = Animation().switchFrames

  if (
    hero().anim != "idle" &&
    hero().anim != "idleB" &&
    hero().anim != "switchIdleIdleB" &&
    hero().anim != "switchIdleBIdle"
  ) {
    hero().anim = "idle"
  }

  if (Frame().current == switchFrames.idleIdleB) {
    hero().animFrame = Frame().current
    hero().anim = "idleB"
  }
  if (
    Frame().current % framerate == 0 &&
    Math.random() < 0.15 &&
    hero().status == "idle" &&
    hero().anim === "idle" &&
    Frame().current >= hero().animFrame + framerate * 2
  ) {
    hero().anim = "switchIdleIdleB"
    hero().animFrame = Frame().current
    switchFrames.idleIdleB = Frame().current + framerate
  }

  if (Frame().current == switchFrames.idleBIdle) {
    hero().animFrame = Frame().current
    hero().anim = "idle"
  }
  if (
    Frame().current % framerate == 0 &&
    Math.random() < 0.1 &&
    hero().status == "idle" &&
    hero().anim === "idleB" &&
    Frame().current >= hero().animFrame + framerate * 2
  ) {
    hero().anim = "switchIdleBIdle"
    hero().animFrame = Frame().current
    switchFrames.idleBIdle = Frame().current + framerate
  }
}
