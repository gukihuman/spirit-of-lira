//
export default class Animation {
  process() {
    // no point to update animations if hero for some reason is not chosen
    // it servers as a camera target
    if (!GLOBAL.hero) return

    WORLD.entities.forEach((entity, id) => {
      if (!entity.visual || !entity.position) return

      this.updateAnimation(entity, id)

      const container = PIXI_GUKI.getContainer(id)
      if (!container) return

      // update container coordinates
      container.x = entity.position.x - GLOBAL.hero.position.x + 960
      container.y = entity.position.y - GLOBAL.hero.position.y + 540

      // update visibility of animations
      if (entity.alive) {
        PIXI_GUKI.getAnimationContainer(id)?.children.forEach((child) => {
          if (child.name === entity.visual.animation) child.visible = true
          else child.visible = false
        })
      } else {
        const animationContainer = PIXI_GUKI.getAnimationContainer(id)
        if (animationContainer && animationContainer.children[0]) {
          animationContainer.children[0].visible = true
        }
      }

      // update animation frame on first animation tick
      const firstFrames = entity.visual.firstFrames
      if (entity.alive && firstFrames) {
        const lastEntity = CACHE.entities.get(id)
        if (!lastEntity) return
        _.forEach(firstFrames, (frame: number, state: string) => {
          if (
            entity.visual.animation === state &&
            lastEntity.visual.animation !== state
          ) {
            PIXI_GUKI.getAnimationSprite(id, state)?.gotoAndPlay(frame)
          }
        })
      }
    })

    this.synchronizeItems()
  }

  private updateAnimation(entity, id) {
    if (!entity.alive) return

    if (PIXI_GUKI.elapsedMS - entity.visual.lastAnimationSwitchMS < 200) return

    if (
      entity.visual.leaveAnimationConditions &&
      entity.alive.state !== "attack"
    ) {
      if (
        entity.visual.animation === "move" &&
        !entity.visual.leaveAnimationConditions.move(entity, id)
      )
        return
    }

    this.checkMove(entity, id)
    this.checkAttack(entity, id)

    const lastEntity = CACHE.entities.get(id)
    if (!lastEntity) return

    if (entity.visual.animation !== lastEntity.visual.animation) {
      entity.visual.lastAnimationSwitchMS = PIXI_GUKI.elapsedMS
    }
  }

  private checkMove(entity, id) {
    const lastEntity = CACHE.entities.get(id)
    if (!lastEntity) return

    const displacement = LIB.vectorFromPoints(
      entity.position,
      lastEntity.position
    )
    const distance = displacement.distance
    const speedPerTick = LIB.speedPerTick(entity)

    // dont update animations on fps-dropping iterations
    const fps = PIXI_GUKI.app?.ticker.FPS
    if (fps && fps / PIXI_GUKI.averageFPS < 0.3) return

    if (distance / speedPerTick < 0.1) {
      entity.visual.animation = "idle"
      return
    }

    if (PIXI_GUKI.getAnimationSprite(id, "walk")) {
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
    if (!entity.alive || !entity.attack) return
    if (entity.alive.state !== "attack") return

    if (id === GLOBAL.heroId) {
      entity.visual.animation = "sword-attack"
    } else {
      entity.visual.animation = "attack"
    }
  }

  private synchronizeItems() {
    const currentAnimation = GLOBAL.hero.visual.animation

    const back = PIXI_GUKI.getContainer(GLOBAL.heroId)?.children[0] as Container
    const front = PIXI_GUKI.getContainer(GLOBAL.heroId)
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
