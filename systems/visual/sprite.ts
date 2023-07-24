//
export default class {
  //
  framesToValidate = 5

  process() {
    // no point to update animations if hero for some reason is not chosen
    // it servers as a camera target
    if (!WORLD.hero) return

    WORLD.entities.forEach((entity, id) => {
      if (!entity.sprite || !entity.position) return

      this.updateAnimation(entity, id)
      this.updateLastChangeMS(entity, id)

      const container = WORLD.getContainer(id)
      if (!container) return

      // update container coordinates
      container.x = entity.position.x - WORLD.hero.position.x + 960
      container.y = entity.position.y - WORLD.hero.position.y + 540

      // update visibility of animations
      if (entity.move) {
        WORLD.getLayer(id, "middle")?.children.forEach((child) => {
          if (child.name === entity.sprite.resolved) child.visible = true
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
        _.forEach(firstFrames, (frame: number, sprite: string) => {
          if (
            entity.sprite.resolved === sprite &&
            lastEntity.sprite.resolved !== sprite
          ) {
            WORLD.getSprite(id, sprite)?.gotoAndPlay(frame)
          }
        })
      }
    })
  }
  private updateLastChangeMS(entity, id) {
    //
    const lastEntity = LAST_WORLD.entities.get(id)
    if (!lastEntity) return

    if (entity.sprite.resolved !== lastEntity.sprite.resolved) {
      //
      WORLD.entities.get(id).sprite.lastChangeMS = WORLD.loop.elapsedMS
    }
  }
  private updateAnimation(entity, id) {
    if (!entity.move) return

    if (
      entity.sprite.leaveAnimationConditions &&
      entity.state.resolved !== "attack"
    ) {
      if (
        entity.sprite.resolved === "move" &&
        !entity.sprite.leaveAnimationConditions.move(entity, id)
      )
        return
    }

    this.checkDeath(entity, id)

    if (entity.state.resolved !== "dead") {
      this.checkMove(entity, id)
      this.checkAttack(entity, id)
    }
  }

  private checkDeath(entity, id) {
    if (entity.state.resolved === "dead") entity.sprite.resolved = "death"
  }

  private checkMove(entity, id) {
    if (!entity.move || entity.state.resolved === "attack") return

    // 📜 maybe do something like
    // dont update animations on fps-dropping iterations
    // const fps = WORLD.app?.ticker.FPS
    // if (fps && fps / WORLD.loop.fps < 0.3) return

    const lastEntity = LAST_WORLD.entities.get(id)
    if (!lastEntity) return

    const distance = COORDINATES.distance(entity.position, lastEntity.position)
    const speedPerTick = COORDINATES.speedPerTick(entity)

    if (distance / speedPerTick < 0.1) {
      //
      this.setSprite(entity, id, "idle")
      return
    }
    if (WORLD.getSprite(id, "walk")) {
      //
      if (distance / speedPerTick < 0.8) {
        //
        this.setSprite(entity, id, "walk")
        return
        //
      } else {
        //
        this.setSprite(entity, id, "run")
        return
      }
    } else {
      //
      this.setSprite(entity, id, "move")
      return
    }
  }
  private checkAttack(entity, id) {
    //
    if (!entity.move || !entity.attack) return
    if (entity.state.resolved !== "attack") return

    if (id === WORLD.heroId) {
      this.setSprite(entity, id, "sword-attack")
    } else {
      this.setSprite(entity, id, "attack")
    }
  }

  /** sets sprite if enough frames are validated */
  private setSprite(entity, id, sprite: string) {
    //
    const lastEntity = LAST_WORLD.entities.get(id)
    if (!lastEntity) return

    entity.sprite.onValidating = sprite

    if (lastEntity.sprite.onValidating !== entity.sprite.onValidating) {
      entity.sprite.framesValidated = 0
      return
    }

    if (lastEntity.sprite.framesValidated >= this.framesToValidate) {
      //
      entity.sprite.resolved = sprite
      return
    }
    entity.sprite.framesValidated++
  }
}
