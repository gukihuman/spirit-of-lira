export default {
  name: "bunbo",
  alive: {
    speed: 10,
    size: 35,
    leaveStateConditions: {
      move: (entity, id) => {
        return gpixi.getAnimationSprite(id, "move")?.currentFrame === 0
      },
    },
  },
}
