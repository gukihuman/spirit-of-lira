export default class bunbo {
  alive = {
    speed: 10,
    size: 50,
    leaveStateConditions: {
      move: (entity, id) => {
        return gpixi.getAnimationSprite(id, "move")?.currentFrame === 0
      },
    },
  }
  visual = {
    path: new URL("/assets/entities/bunbo.json", import.meta.url).href,
  }
}
