function heroIdleAnim() {
  if (
    Frame().current % 60 == 0 &&
    Math.random() < 0.15 &&
    hero().status === "idle" &&
    Frame().current >= hero().statusFrame + 60 * 2
  ) {
    hero().status = "switchIdleIdleB"
    HeroIdleStatus().idleIdleB = Frame().current + 60
  }
  if (Frame().current == HeroIdleStatus().idleIdleB) {
    hero().status = "idleB"
  }

  if (
    Frame().current % 60 == 0 &&
    Math.random() < 0.1 &&
    hero().status === "idleB" &&
    Frame().current >= hero().statusFrame + 60 * 2
  ) {
    hero().status = "switchIdleBIdle"
    HeroIdleStatus().idleBIdle = Frame().current + 60
  }
  if (Frame().current == HeroIdleStatus().idleBIdle) {
    hero().status = "idle"
  }
}

function checkMove(entity) {
  if (entity.x === entity.prevX && entity.y === entity.prevY) {
    if (
      entity.name === "hero" &&
      entity.status.toLowerCase().includes("idle")
    ) {
      heroIdleAnim()
    } else {
      entity.status = "idle"
    }
  } else {
    entity.status = "walk"
  }

  if (entity.prevX > entity.x) {
    entity.mirrored = true
  } else if (entity.prevX < entity.x) {
    entity.mirrored = false
  }

  entity.prevX = entity.x
  entity.prevY = entity.y
}

export function statusManager() {
  Game().entities.forEach((entity) => {
    const currentStatus = entity.status

    checkMove(entity)

    if (currentStatus !== entity.status) {
      entity.statusFrame = Frame().current
    }
  })
}
