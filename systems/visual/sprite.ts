//
export default class {
  //
  framesToValidate = 5

  init() {
    EVENTS.on("entityCreated", (data) => {
      SPRITE.createEntitySprite(data.entity, data.id)
    })
  }

  process() {
    //
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
          if (child.name === entity.sprite.active) child.visible = true
          else child.visible = false
        })
      } else {
        const animationContainer = WORLD.getLayer(id, "middle")
        if (animationContainer && animationContainer.children[0]) {
          animationContainer.children[0].visible = true
        }
      }

      // update animation frame on first animation tick
      const startFrames = entity.sprite.startFrames
      if (entity.move && startFrames) {
        const lastEntity = LAST_WORLD.entities.get(id)
        if (!lastEntity) return
        _.forEach(startFrames, (frame: number, sprite: string) => {
          if (
            entity.sprite.active === sprite &&
            lastEntity.sprite.active !== sprite
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

    if (entity.sprite.active !== lastEntity.sprite.active) {
      //
      WORLD.entities.get(id).sprite.lastChangeMS = WORLD.loop.elapsedMS
    }
  }
  private updateAnimation(entity, id) {
    if (!entity.move) return

    if (
      entity.sprite.leaveAnimationConditions &&
      entity.state.active !== "attack"
    ) {
      if (
        entity.sprite.active === "move" &&
        !entity.sprite.leaveAnimationConditions.move(entity, id)
      )
        return
    }

    this.checkDeath(entity, id)

    if (entity.state.active !== "dead") {
      this.checkMove(entity, id)
      this.checkAttack(entity, id)
    }
  }
  private checkDeath(entity, id) {
    if (entity.state.active === "dead") entity.sprite.active = "death"
  }
  private checkMove(entity, id) {
    if (!entity.move || entity.state.active === "attack") return

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
    if (entity.state.active !== "attack") return

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

    entity.sprite.onValidation = sprite

    if (lastEntity.sprite.onValidation !== entity.sprite.onValidation) {
      entity.sprite.framesValidated = 0
      return
    }
    if (lastEntity.sprite.framesValidated >= this.framesToValidate) {
      //
      entity.sprite.active = sprite
      return
    }
    entity.sprite.framesValidated++
  }
}
