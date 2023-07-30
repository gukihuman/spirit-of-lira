//
export default class {
  //
  framesToValidate = 3

  init() {
    //
    EVENTS.on("entityCreated", (data) => {
      //
      if (data.entity.name === "lira") {
        //
        SPRITE.createEntitySprite(data.entity, data.id, {
          //
          randomFlip: false,
          layers: [
            "shadow",
            "backEffect",
            "backWeapon",
            "main",
            "clothes",
            "frontWeapon",
            "frontEffect",
          ],
        })

        return
      }

      if (!data.entity.move) {
        //
        SPRITE.createEntitySprite(data.entity, data.id, {
          //
          randomFlip: false,
        })

        return
      }

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
        WORLD.getLayer(id, "main")?.children.forEach((child) => {
          //
          if (child.name === entity.sprite.active) child.visible = true
          else child.visible = false
        })
      } else {
        //
        const main = WORLD.getLayer(id, "main")
        if (main && main.children[0]) {
          main.children[0].visible = true
        }
      }
      // update animation frame on first animation tick
      if (entity.move) {
        //
        const lastEntity = LAST_WORLD.entities.get(id)
        if (!lastEntity) return

        WORLD.getLayer(id, "main")?.children.forEach((animation) => {
          if (
            entity.sprite.active === animation.name &&
            lastEntity.sprite.active !== animation.name
          ) {
            const frame = entity.sprite.startFrames[animation.name]

            if (frame) {
              WORLD.getSprite(id, animation.name)?.gotoAndPlay(frame)
            } else {
              WORLD.getSprite(id, animation.name)?.gotoAndPlay(0)
            }
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
