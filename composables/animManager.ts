function heroIdleAnim() {
  let switchFrames = Animation().hero.idleSwitchFrames

  if (
    hero().anim != "idle" &&
    hero().anim != "idleB" &&
    hero().anim != "switchIdleIdleB" &&
    hero().anim != "switchIdleBIdle"
  ) {
    hero().anim = "idle"
  }

  if (Frame().current == switchFrames.idleIdleB) {
    hero().anim = "idleB"
  }
  if (
    Frame().current % 60 == 0 &&
    Math.random() < 0.15 &&
    hero().status == "idle" &&
    hero().anim === "idle" &&
    Frame().current >= hero().animFrame + 60 * 2
  ) {
    hero().anim = "switchIdleIdleB"
    switchFrames.idleIdleB = Frame().current + 60
  }

  if (Frame().current == switchFrames.idleBIdle) {
    hero().anim = "idle"
  }
  if (
    Frame().current % 60 == 0 &&
    Math.random() < 0.1 &&
    hero().status == "idle" &&
    hero().anim === "idleB" &&
    Frame().current >= hero().animFrame + 60 * 2
  ) {
    hero().anim = "switchIdleBIdle"
    switchFrames.idleBIdle = Frame().current + 60
  }
}

export function animManager() {
  Game().entities.forEach((entity) => {
    const currentAnim = entity.anim

    if (entity.name === "hero") {
      entity.status === "idle" ? heroIdleAnim() : {}
      entity.status === "move" ? (entity.anim = "walk") : {}
    } else {
      entity.status === "idle" ? (entity.anim = "idle") : {}
    }

    if (currentAnim !== entity.anim) {
      entity.animFrame = Frame().current
    }
  })
}
