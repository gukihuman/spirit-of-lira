export default {
  name: "bunbo",
  size: {
    width: 70,
    height: 60,
  },
  visual: {
    leaveAnimationConditions: {
      move: (entity, id) => {
        return PIXI_GUKI.getAnimationSprite(id, "move")?.currentFrame === 0
      },
    },
    firstFrames: { attack: 18 },
  },
  alive: {
    speed: 8,
  },
  attack: {
    distance: 40,
  },
}
