export default {
  name: "bunbo",
  alive: {
    width: 70,
    height: 60,

    speed: 8,
    leaveStateConditions: {
      move: (entity, id) => {
        return PIXI_GUKI.getAnimationSprite(id, "move")?.currentFrame === 0
      },
    },
  },
  attack: {
    distance: 120,
  },
}
