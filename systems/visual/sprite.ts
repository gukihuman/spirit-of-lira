//
export default class {
  //
  // delays sprite change after state change, prevents sprite flickering
  spriteDelayMS = 100

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
        _.forEach(firstFrames, (frame: number, sprite: string) => {
          if (
            entity.sprite.animation === sprite &&
            lastEntity.sprite.animation !== sprite
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

    if (entity.sprite.animation !== lastEntity.sprite.animation) {
      WORLD.entities.get(id).sprite.lastChangeMS = WORLD.loop.elapsedMS
    }
  }
  private updateAnimation(entity, id) {
    if (!entity.move) return

    if (WORLD.loop.elapsedMS - entity.sprite.animationMS < 200) return

    if (
      entity.sprite.leaveAnimationConditions &&
      entity.state.resolved !== "attack"
    ) {
      if (
        entity.sprite.animation === "move" &&
        !entity.sprite.leaveAnimationConditions.move(entity, id)
      )
        return
    }

    this.checkDeath(entity, id)

    if (entity.state.resolved !== "dead") {
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
    if (entity.state.resolved === "dead") entity.sprite.animation = "death"
  }

  private checkMove(entity, id) {
    if (!entity.move) return

    // 📜 maybe do something like
    // dont update animations on fps-dropping iterations
    // const fps = WORLD.app?.ticker.FPS
    // if (fps && fps / WORLD.loop.averageFPS < 0.3) return

    if (
      entity.move.lastAverageDistance / entity.move.lastAverageSpeedPerTick <
      0.1
    ) {
      //
      this.setSprite(entity, "idle")
      return
    }
    if (WORLD.getSprite(id, "walk")) {
      //
      if (
        entity.move.lastAverageDistance / entity.move.lastAverageSpeedPerTick <
        0.8
      ) {
        //
        this.setSprite(entity, "walk")
        return
        //
      } else {
        //
        this.setSprite(entity, "run")
        return
      }
    } else {
      //
      this.setSprite(entity, "move")
      return
    }
  }
  private checkAttack(entity, id) {
    if (!entity.move || !entity.attack) return
    if (entity.state.resolved !== "attack") return

    if (id === WORLD.heroId) {
      this.setSprite(entity, "sword-attack")
    } else {
      this.setSprite(entity, "attack")
    }
  }

  //** sets sprite if sprite delay is elapsed */
  private setSprite(entity, sprite: string) {
    //
    if (
      WORLD.loop.elapsedMS >
      entity.sprite.lastChangeMS + this.spriteDelayMS
    ) {
      //
      entity.sprite.animation = sprite
    }
  }
}
