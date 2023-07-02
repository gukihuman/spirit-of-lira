//
export default class {
  process() {
    // no point to update animations if hero for some reason is not chosen
    // it servers as a camera target
    if (!SYSTEM_DATA.world.hero) return

    ENTITIES.forEach((entity, id) => {
      if (!entity.visual || !entity.position) return

      this.updateAnimation(entity, id)

      const container = GPIXI.getMain(id)
      if (!container) return

      // update container coordinates
      container.x = entity.position.x - SYSTEM_DATA.world.hero.position.x + 960
      container.y = entity.position.y - SYSTEM_DATA.world.hero.position.y + 540

      // update visibility of animations
      if (entity.move) {
        GPIXI.getMiddle(id)?.children.forEach((child) => {
          if (child.name === entity.visual.animation) child.visible = true
          else child.visible = false
        })
      } else {
        const animationContainer = GPIXI.getMiddle(id)
        if (animationContainer && animationContainer.children[0]) {
          animationContainer.children[0].visible = true
        }
      }

      // update animation frame on first animation tick
      const firstFrames = entity.visual.firstFrames
      if (entity.move && firstFrames) {
        const lastEntity = SYSTEMS.lasttick.entities.get(id)
        if (!lastEntity) return
        _.forEach(firstFrames, (frame: number, state: string) => {
          if (
            entity.visual.animation === state &&
            lastEntity.visual.animation !== state
          ) {
            GPIXI.getSprite(id, state)?.gotoAndPlay(frame)
          }
        })
      }
    })

    this.synchronizeItems()
  }

  private updateAnimation(entity, id) {
    if (!entity.move) return

    if (GPIXI.elapsedMS - entity.visual.animationMS < 200) return

    if (
      entity.visual.leaveAnimationConditions &&
      entity.state.main !== "attack"
    ) {
      if (
        entity.visual.animation === "move" &&
        !entity.visual.leaveAnimationConditions.move(entity, id)
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

    if (entity.visual.animation !== lastEntity.visual.animation) {
      entity.visual.animationMS = GPIXI.elapsedMS
    }
  }

  private checkDeath(entity, id) {
    if (entity.state.main === "dead") entity.visual.animation = "death"
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
      entity.visual.animation = "idle"
      return
    }

    if (GPIXI.getSprite(id, "walk")) {
      if (distance / speedPerTick < 0.8) {
        entity.visual.animation = "walk"
        return
      } else {
        entity.visual.animation = "run"
        return
      }
    } else {
      entity.visual.animation = "move"
      return
    }
  }

  private checkAttack(entity, id) {
    if (!entity.move || !entity.attack) return
    if (entity.state.main !== "attack") return

    if (id === SYSTEM_DATA.world.heroId) {
      entity.visual.animation = "sword-attack"
    } else {
      entity.visual.animation = "attack"
    }
  }

  private synchronizeItems() {
    const currentAnimation = SYSTEM_DATA.world.hero.visual.animation

    const back = GPIXI.getMain(SYSTEM_DATA.world.heroId)
      ?.children[0] as Container
    const front = GPIXI.getMain(SYSTEM_DATA.world.heroId)
      ?.children[2] as Container
    if (!back || !front) return

    back.children.forEach((child) => {
      const itemContainer = child as Container
      itemContainer.children.forEach((sprite) => {
        if (
          sprite.name === currentAnimation ||
          (sprite.name === "idle" && currentAnimation === "run") ||
          (sprite.name === "idle" && currentAnimation === "walk")
        ) {
          sprite.visible = true
        } else {
          sprite.visible = false
        }
      })
    })
  }
}
