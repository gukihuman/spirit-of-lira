function moved(entity) {
  if (entity.x === entity.prevX && entity.y === entity.prevY) {
    return false
  } else {
    return true
  }
}

function mirrored(entity) {
  if (!entity.status.toLowerCase().includes("attack")) {
    if (entity.prevX > entity.x) {
      entity.mirrored = true
    } else if (entity.prevX < entity.x) {
      entity.mirrored = false
    }
  } else {
    const targetEntity = Game().entities.find((e) => e.id == entity.targetId)
    if (targetEntity.x < entity.x) {
      entity.mirrored = true
    } else if (targetEntity.x > entity.x) {
      entity.mirrored = false
    }
  }
}

function targetInRange(entity) {
  if (entity.targetDistance < entity.range) {
    return true
  } else {
    return false
  }
}

function setIdle(entity) {
  if (
    entity.name === "hero" &&
    entity.status.toLowerCase().includes("idle") // not first idle frame
  ) {
    idleAnim(entity)
  } else {
    entity.status = "idle" // first idle frame
  }
}

function idleAnim(entity) {
  if (
    Frame().current % 60 == 0 &&
    Math.random() < 0.2 &&
    entity.status === "idle" &&
    Frame().current >= entity.statusFrame + 60 * 2
  ) {
    entity.status = "switchIdleIdleB"
  }
  if (
    entity.status === "switchIdleIdleB" &&
    entity.statusFrame + 15 === Frame().current
  ) {
    entity.status = "idleB"
  }

  if (
    Frame().current % 60 == 0 &&
    Math.random() < 0.25 &&
    entity.status === "idleB" &&
    Frame().current >= entity.statusFrame + 60 * 2
  ) {
    entity.status = "switchIdleBIdle"
  }
  if (
    entity.status === "switchIdleBIdle" &&
    entity.statusFrame + 15 === Frame().current
  ) {
    entity.status = "idle"
  }
}

function setMove(entity) {
  const distanceX = Math.abs(entity.x - entity.prevX)
  const distanceY = Math.abs(entity.y - entity.prevY)
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
  if ((entity.speed / 6) * 0.95 > distance) {
    entity.status = "walk"
  } else {
    entity.status = "run"
  }
}

function setHeroAttack(entity) {
  if (!entity.status.toLowerCase().includes("attack")) {
    entity.status = "bowAttackSetup"
  } else if (
    entity.status === "bowAttackSetup" &&
    entity.statusFrame + 30 === Frame().current
  ) {
    entity.status = "bowAttackDelay"
  } else if (
    entity.status === "bowAttackDelay" &&
    entity.statusFrame + 60 === Frame().current
  ) {
    entity.status = "bowAttackRelease"
  } else if (
    entity.status === "bowAttackRelease" &&
    entity.statusFrame + 15 === Frame().current
  ) {
    entity.status = "bowAttackSetup"
  }
}

function setAttack(entity) {
  if (!entity.status.toLowerCase().includes("attack")) {
    entity.status = "attackSetup"
  } else if (
    entity.status === "attackSetup" &&
    entity.statusFrame + 30 === Frame().current
  ) {
    entity.status = "attackDelay"
  } else if (
    entity.status === "attackDelay" &&
    entity.statusFrame + 15 === Frame().current
  ) {
    entity.status = "attackRelease"
  } else if (
    entity.status === "attackRelease" &&
    entity.statusFrame + 15 === Frame().current
  ) {
    entity.status = "attackSetup"
  }
}

export function statusManager() {
  Game().entities.forEach((entity) => {
    const currentStatus = entity.status

    if (moved(entity)) {
      entity.name === "hero" ? setMove(entity) : (entity.status = "run")
    } else {
      if (targetInRange(entity)) {
        entity.name === "hero" ? setHeroAttack(entity) : setAttack(entity)
      } else {
        setIdle(entity)
      }
    }

    mirrored(entity)
    entity.prevX = entity.x
    entity.prevY = entity.y
    if (currentStatus !== entity.status) {
      entity.statusFrame = Frame().current
    }
  })
}
