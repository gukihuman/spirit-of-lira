export default class bunbo {
  alive = {
    speed: 10,
    size: 37,
    leaveStateConditions: {
      move: (entity, id) => {
        return gpixi.getAnimationSprite(id, "move")?.currentFrame === 0
      },
    },
  }
  visual = {}
}
