import { first } from "lodash"

export default class Render {
  process() {
    // no point to render anything if hero for some reason is not chosen
    // cuz it servers as a camera target
    const heroEntity = gworld.entities.get(gsd.states.heroId)
    if (!heroEntity) return
    const heroPosition = heroEntity.get("position")

    gworld.entities.forEach((entity, id) => {
      if (!entity.get("visual") || !entity.get("position")) return
      const position = entity.get("position")
      const container = gpixi.getContainer(id)
      if (!container) return

      // update container coordinates
      container.x = position.x - heroPosition.x + 960
      container.y = position.y - heroPosition.y + 540

      // update visibility of animations by entity state
      if (entity.get("alive")) {
        gpixi.getAnimationContainer(id)?.children.forEach((child) => {
          if (child.name === entity.get("alive").state) child.visible = true
          else child.visible = false
        })
      } else {
        const animationContainer = gpixi.getAnimationContainer(id)
        if (animationContainer) container.children[0].visible = true
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
            gpixi.getAnimationSprite(id, state)?.gotoAndPlay(frame)
          }
        })
      }
    })
  }
}
