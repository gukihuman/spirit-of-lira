class SpriteUpdate {
  private framesToValidate = 3
  private walkRunRatio = 0.9
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.sprite || !entity.position) return
      const container = SPRITE.getContainer(id)
      if (!container) return
      this.updateAnimation(entity, id)
      this.updateLastChangeMS(entity, id)
      this.updateCoordinates(entity, container)
      this.updateVisibility(entity, id)
      this.updateFirstFrameOfState(entity, id)
    })
    this.updateItems()
  }
  private updateFirstFrameOfState(entity, id) {
    if (entity.move) {
      const lastEntity = LAST.entities.get(id)
      if (!lastEntity) return
      SPRITE.getLayer(id, "animation")?.children.forEach((animation) => {
        if (
          entity.sprite.active === animation.name &&
          lastEntity.sprite.active !== animation.name
        ) {
          const frame = entity.sprite.startFrames[animation.name]
          if (frame) {
            SPRITE.getAnimation(id, animation.name)?.gotoAndPlay(frame)
          } else {
            SPRITE.getAnimation(id, animation.name)?.gotoAndPlay(0)
          }
        }
      })
    }
  }
  private updateCoordinates(entity, container) {
    container.x =
      entity.position.x - WORLD.hero.position.x + CONFIG.viewport.width / 2
    container.y =
      entity.position.y - WORLD.hero.position.y + CONFIG.viewport.height / 2
  }
  private updateVisibility(entity, id) {
    if (entity.move) {
      SPRITE.getLayer(id, "animation")?.children.forEach((child) => {
        if (child.name === entity.sprite.active) child.visible = true
        else child.visible = false
      })
    } else {
      const animation = SPRITE.getLayer(id, "animation")
      if (animation && animation.children[0]) {
        animation.children[0].visible = true
      }
    }
  }
  private getHeroCastSprite(entity, id) {
    // 📜 add sprite handling for other skills than attack
    // now weapon sprite option controls cast sprite
    // but it should be skill first by adding offensive or nutral options
    if (WORLD.isHero(id)) {
      return ITEMS.weapons[INVENTORY.equipped.weapon].sprite
    } else {
      return entity.skills.active
    }
  }
  private updateItems() {
    const heroSpriteName = this.getHeroCastSprite(WORLD.hero, WORLD.heroId)
    const heroAnimation = SPRITE.getAnimation(WORLD.heroId, heroSpriteName)
    const frontWeapon = SPRITE.getLayer(WORLD.heroId, "frontWeapon")
    const backWeapon = SPRITE.getLayer(WORLD.heroId, "backWeapon")
    if (!heroAnimation || !frontWeapon || !backWeapon) return
    // syncronize all weapon sprites in cast state
    // turn visibility on for cast and off for non-attack
    // 📜 check if skill is neutral to not update and leave weapon idle
    if (WORLD.hero.sprite.active === heroSpriteName) {
      frontWeapon.children.forEach((child) => {
        const sprite = child as AnimatedSprite
        sprite.gotoAndPlay(heroAnimation.currentFrame)
      })
      frontWeapon.visible = true
      backWeapon.visible = false
    } else {
      backWeapon.visible = true
      frontWeapon.visible = false
    }
  }
  private updateAnimation(entity, id) {
    if (!entity.state) return

    if (
      entity.sprite.leaveAnimationConditions &&
      entity.state.active !== "cast"
    ) {
      if (
        entity.sprite.active === "move" &&
        !entity.sprite.leaveAnimationConditions.move(entity, id)
      )
        return
    }

    if (entity.state.active === "dead") {
      entity.sprite.active = "dead"
      return
    }

    this.checkMove(entity, id)
    this.checkCast(entity, id)
  }
  private checkMove(entity, id) {
    if (!entity.move || entity.state.active === "cast") return

    const lastEntity = LAST.entities.get(id)
    if (!lastEntity) return

    const distance = COORD.distance(entity.position, lastEntity.position)
    const speedPerTick = COORD.speedPerTick(entity)

    if (distance / speedPerTick < 0.1) {
      //
      this.setWithValidation(entity, id, "idle")
      return
    }
    if (SPRITE.getAnimation(id, "walk")) {
      //
      if (distance / speedPerTick < this.walkRunRatio) {
        //
        this.setWithValidation(entity, id, "walk")
        return
        //
      } else {
        //
        this.setWithValidation(entity, id, "run")
        return
      }
    } else {
      //
      this.setWithValidation(entity, id, "move")
      return
    }
  }
  private checkCast(entity, id) {
    //
    if (!entity.move || !entity.skills) return
    if (entity.state.active !== "cast") return

    if (id === WORLD.heroId) {
      entity.sprite.active = this.getHeroCastSprite(WORLD.hero, WORLD.heroId)
    } else {
      entity.sprite.active = "attack"
    }
  }
  /** sets sprite if enough frames are validated */
  private setWithValidation(entity, id, sprite: string) {
    //
    const lastEntity = LAST.entities.get(id)
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
  private updateLastChangeMS(entity, id) {
    const lastEntity = LAST.entities.get(id)
    if (!lastEntity) return
    if (entity.sprite.active !== lastEntity.sprite.active) {
      WORLD.entities.get(id).sprite.lastChangeMS = WORLD.loop.elapsedMS
    }
  }
}
export const SPRITE_UPDATE = new SpriteUpdate()
