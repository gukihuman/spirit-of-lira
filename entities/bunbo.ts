export default class bunbo {
  alive = {
    speed: 10,
    size: 35,
    leaveStateConditions: {
      move: (entity, id) => {
        return gp.getAnimationSprite(id, "move")?.currentFrame === 0
      },
    },
  }
  visual = {}
}
