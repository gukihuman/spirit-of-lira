//
export default class {
  process() {
    // no point to update animations if hero for some reason is not chosen
    // it servers as a camera target
    if (!SYSTEM_DATA.world.hero) return

    ENTITIES.forEach((entity, id) => {
      if (!entity.sprite || !entity.position) return

      this.updateAnimation(entity, id)

      const container = GPIXI.getMain(id)
      if (!container) return

      // update container coordinates
      container.x = entity.position.x - SYSTEM_DATA.world.hero.position.x + 960
      container.y = entity.position.y - SYSTEM_DATA.world.hero.position.y + 540

      // update visibility of animations
      if (entity.move) {
        GPIXI.getMiddle(id)?.children.forEach((child) => {
          if (child.name === entity.sprite.animation) child.visible = true
          else child.visible = false
        })
      } else {
        const animationContainer = GPIXI.getMiddle(id)
        if (animationContainer && animationContainer.children[0]) {
          animationContainer.children[0].visible = true
        }
      }

      // update animation frame on first animation tick
      const firstFrames = entity.sprite.firstFrames
      if (entity.move && firstFrames) {
        const lastEntity = SYSTEMS.lasttick.entities.get(id)
        if (!lastEntity) return
        _.forEach(firstFrames, (frame: number, state: string) => {
          if (
            entity.sprite.animation === state &&
            lastEntity.sprite.animation !== state
          ) {
            GPIXI.getSprite(id, state)?.gotoAndPlay(frame)
          }
        })
      }
    })
  }

  private updateAnimation(entity, id) {
    if (!entity.move) return

    if (GPIXI.elapsedMS - entity.sprite.animationMS < 200) return

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

    const lastEntity = SYSTEMS.lasttick.entities.get(id)
    if (!lastEntity) return

    if (entity.sprite.animation !== lastEntity.sprite.animation) {
      entity.sprite.animationMS = GPIXI.elapsedMS
    }
  }

  private checkDeath(entity, id) {
    if (entity.state.main === "dead") entity.sprite.animation = "death"
  }

  private checkMove(entity, id) {
    const lastEntity = SYSTEMS.lasttick.entities.get(id)
    if (!lastEntity) return

    const displacement = LIB.vectorFromPoints(
      entity.position,
      lastEntity.position
    )
    const distance = displacement.distance
    const speedPerTick = LIB.speedPerTick(entity)

    // dont update animations on fps-dropping iterations
    const fps = GPIXI.app?.ticker.FPS
    if (fps && fps / GPIXI.averageFPS < 0.3) return

    if (distance / speedPerTick < 0.1) {
      entity.state.startIdleTickCounter++
      if (entity.state.startIdleTickCounter > 10) {
        entity.state.startWalkTickCounter = 0
        entity.sprite.animation = "idle"
      }
      return
    }
    entity.state.startIdleTickCounter = 0

    if (GPIXI.getSprite(id, "walk")) {
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

    if (id === SYSTEM_DATA.world.heroId) {
      entity.sprite.animation = "sword-attack"
    } else {
      entity.sprite.animation = "attack"
    }
  }
}
