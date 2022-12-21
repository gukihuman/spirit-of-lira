function moved(entity) {
  if (entity.x === entity.prevX && entity.y === entity.prevY) {
    return false
  } else {
    return true
  }
}

function mirrored(entity) {
  if (!entity.state.toLowerCase().includes("attack")) {
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
    entity.state.toLowerCase().includes("idle") // not first idle frame
  ) {
    idleAnim(entity)
  } else {
    entity.state = "idle" // first idle frame
  }
}

function idleAnim(entity) {
  if (
    Game().frame % 60 == 0 &&
    Math.random() < 0.2 &&
    entity.state === "idle" &&
    Game().frame >= entity.stateFrame + 60 * 2
  ) {
    entity.state = "switchIdleIdleB"
  }
  if (
    entity.state === "switchIdleIdleB" &&
    entity.stateFrame + 15 === Game().frame
  ) {
    entity.state = "idleB"
  }

  if (
    Game().frame % 60 == 0 &&
    Math.random() < 0.25 &&
    entity.state === "idleB" &&
    Game().frame >= entity.stateFrame + 60 * 2
  ) {
    entity.state = "switchIdleBIdle"
  }
  if (
    entity.state === "switchIdleBIdle" &&
    entity.stateFrame + 15 === Game().frame
  ) {
    entity.state = "idle"
  }
}

function setMove(entity) {
  const distanceX = Math.abs(entity.x - entity.prevX)
  const distanceY = Math.abs(entity.y - entity.prevY)
  const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY)
  if ((entity.speed / 6) * 0.95 > distance) {
    entity.state = "walk"
  } else {
    entity.state = "run"
  }
}

function setHeroAttack(entity) {
  if (!entity.state.toLowerCase().includes("attack")) {
    entity.state = "attackSetup"
  } else if (
    entity.state === "attackSetup" &&
    entity.stateFrame + 30 === Game().frame
  ) {
    entity.state = "attackDelay"
  } else if (
    entity.state === "attackDelay" &&
    entity.stateFrame + 60 === Game().frame
  ) {
    entity.state = "attackRelease"
  } else if (
    entity.state === "attackRelease" &&
    entity.stateFrame + 15 === Game().frame
  ) {
    entity.state = "attackSetup"
  }
}

function setAttack(entity) {
  if (!entity.state.toLowerCase().includes("attack")) {
    entity.state = "attackSetup"
  } else if (
    entity.state === "attackSetup" &&
    entity.stateFrame + 30 === Game().frame
  ) {
    entity.state = "attackDelay"
  } else if (
    entity.state === "attackDelay" &&
    entity.stateFrame + 15 === Game().frame
  ) {
    entity.state = "attackRelease"
  } else if (
    entity.state === "attackRelease" &&
    entity.stateFrame + 15 === Game().frame
  ) {
    entity.state = "attackSetup"
  }
}

export function stateManager() {
  Game().entities.forEach((entity) => {
    const currentStatus = entity.state

    if (moved(entity)) {
      entity.name === "hero" ? setMove(entity) : (entity.state = "run")
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
    if (currentStatus !== entity.state) {
      entity.stateFrame = Game().frame
    }
  })
}
