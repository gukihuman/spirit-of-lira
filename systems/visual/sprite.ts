//
export default class {
  process() {
    // no point to update animations if hero for some reason is not chosen
    // it servers as a camera target
    if (!WORLD.hero) return

    WORLD.entities.forEach((entity, id) => {
      if (!entity.sprite || !entity.position) return

      this.updateAnimation(entity, id)

      const container = WORLD.getContainer(id)
      if (!container) return

      // update container coordinates
      container.x = entity.position.x - WORLD.hero.position.x + 960
      container.y = entity.position.y - WORLD.hero.position.y + 540

      // update visibility of animations
      if (entity.move) {
        WORLD.getLayer(id, "middle")?.children.forEach((child) => {
          if (child.name === entity.sprite.animation) child.visible = true
          else child.visible = false
        })
      } else {
        const animationContainer = WORLD.getLayer(id, "middle")
        if (animationContainer && animationContainer.children[0]) {
          animationContainer.children[0].visible = true
        }
      }

      // update animation frame on first animation tick
      const firstFrames = entity.sprite.firstFrames
      if (entity.move && firstFrames) {
        const lastEntity = LAST_WORLD.entities.get(id)
        if (!lastEntity) return
        _.forEach(firstFrames, (frame: number, state: string) => {
          if (
            entity.sprite.animation === state &&
            lastEntity.sprite.animation !== state
          ) {
            WORLD.getSprite(id, state)?.gotoAndPlay(frame)
          }
        })
      }
    })
  }

  private updateAnimation(entity, id) {
    if (!entity.move) return

    if (WORLD.loop.elapsedMS - entity.sprite.animationMS < 200) return

    if (
      entity.sprite.leaveAnimationConditions &&
      entity.state.main !== "attack"
    ) {
      if (
        entity.sprite.animation === "move" &&
        !entity.sprite.leaveAnimationConditions.move(entity, id)
      )
        return
    }

    this.checkDeath(entity, id)

    if (entity.state.main !== "dead") {
      this.checkMove(entity, id)
      this.checkAttack(entity, id)
    }

    const lastEntity = LAST_WORLD.entities.get(id)
    if (!lastEntity) return

    if (entity.sprite.animation !== lastEntity.sprite.animation) {
      entity.sprite.animationMS = WORLD.loop.elapsedMS
    }
  }

  private checkDeath(entity, id) {
    if (entity.state.main === "dead") entity.sprite.animation = "death"
  }

  private checkMove(entity, id) {
    const lastEntity = LAST_WORLD.entities.get(id)
    if (!lastEntity) return

    const displacement = COORDINATES.vectorFromPoints(
      entity.position,
      lastEntity.position
    )
    const distance = displacement.distance
    const speedPerTick = LIB.speedPerTick(entity)

    // dont update animations on fps-dropping iterations
    const fps = WORLD.app?.ticker.FPS
    if (fps && fps / WORLD.loop.averageFPS < 0.3) return

    if (distance / speedPerTick < 0.1) {
      entity.state.startIdleTickCounter++
      if (entity.state.startIdleTickCounter > 10) {
        entity.state.startWalkTickCounter = 0
        entity.sprite.animation = "idle"
      }
      return
    }
    entity.state.startIdleTickCounter = 0

    if (WORLD.getSprite(id, "walk")) {
      if (distance / speedPerTick < 0.75) {
        entity.state.startWalkTickCounter++
        if (entity.state.startWalkTickCounter > 10) {
          entity.sprite.animation = "walk"
        }
        return
      } else {
        entity.state.startIdleTickCounter = 0
        entity.sprite.animation = "run"
        return
      }
    } else {
      entity.sprite.animation = "move"
      return
    }
  }

  private checkAttack(entity, id) {
    if (!entity.move || !entity.attack) return
    if (entity.state.main !== "attack") return

    if (id === WORLD.heroId) {
      entity.sprite.animation = "sword-attack"
    } else {
      entity.sprite.animation = "attack"
    }
  }
}
