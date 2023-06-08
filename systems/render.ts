export default class Render {
  private synchronizeItems() {
    const currentState = GLOBAL.hero.alive.state

    const back = PIXI_GUKI.getContainer(GLOBAL.heroId)?.children[0] as Container
    const front = PIXI_GUKI.getContainer(GLOBAL.heroId)
      ?.children[2] as Container
    if (!back || !front) return

    back.children.forEach((child) => {
      const itemContainer = child as Container
      itemContainer.children.forEach((sprite) => {
        if (
          sprite.name === currentState ||
          (sprite.name === "idle" && currentState === "run") ||
          (sprite.name === "idle" && currentState === "walk")
        ) {
          sprite.visible = true
        } else {
          sprite.visible = false
        }
      })
    })
  }

  process() {
    // no point to render anything if hero for some reason is not chosen
    // cuz it servers as a camera target
    if (!GLOBAL.hero) return
    const heroPosition = GLOBAL.hero.position

    this.synchronizeItems()

    WORLD.entities.forEach((entity, id) => {
      if (!entity.visual || !entity.position) return
      const position = entity.position
      const container = PIXI_GUKI.getContainer(id)
      if (!container) return

      // update container coordinates
      container.x = position.x - heroPosition.x + 960
      container.y = position.y - heroPosition.y + 540

      // update visibility of animations by entity state
      if (entity.alive) {
        PIXI_GUKI.getAnimationContainer(id)?.children.forEach((child) => {
          if (child.name === entity.alive.state) child.visible = true
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
            entity.alive.state === state &&
            lastEntity.alive.state !== state
          ) {
            PIXI_GUKI.getAnimationSprite(id, state)?.gotoAndPlay(frame)
          }
        })
      }
    })
  }
}
