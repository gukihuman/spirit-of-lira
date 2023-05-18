export default class render {
  private synchronizeItems() {
    const currentState = gworld.entities
      .get(gsd.states.heroId)
      .get("alive").state

    const back = gp.getContainer(gsd.states.heroId)?.children[0] as Container
    const front = gp.getContainer(gsd.states.heroId)?.children[2] as Container
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
    const heroEntity = gworld.entities.get(gsd.states.heroId)
    if (!heroEntity) return
    const heroPosition = heroEntity.get("position")

    this.synchronizeItems()

    gworld.entities.forEach((entity, id) => {
      if (!entity.get("visual") || !entity.get("position")) return
      const position = entity.get("position")
      const container = gp.getContainer(id)
      if (!container) return

      // update container coordinates
      container.x = position.x - heroPosition.x + 960
      container.y = position.y - heroPosition.y + 540

      // update visibility of animations by entity state
      if (entity.get("alive")) {
        gp.getAnimationContainer(id)?.children.forEach((child) => {
          if (child.name === entity.get("alive").state) child.visible = true
          else child.visible = false
        })
      } else {
        const animationContainer = gp.getAnimationContainer(id)
        if (animationContainer) {
          animationContainer.children[0].visible = true
        }
      }

      // update animation frame on first animation tick
      const firstFrames = entity.get("visual").firstFrames
      if (firstFrames) {
        const lastEntity = gcache.entities.get(id)
        if (!lastEntity) return
        _.forEach(firstFrames, (frame: number, state: string) => {
          if (
            entity.get("alive").state === state &&
            lastEntity.get("alive").state !== state
          ) {
            gp.getAnimationSprite(id, state)?.gotoAndPlay(frame)
          }
        })
      }
    })
  }
}
