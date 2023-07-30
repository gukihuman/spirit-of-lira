export default {
  size: {
    width: 70,
    height: 60,
  },
  sprite: {
    leaveAnimationConditions: {
      move: (entity, id) => {
        return WORLD.getAnimation(id, "move")?.currentFrame === 0
      },
    },
    startFrames: { attack: 18 },
  },
  move: {
    speed: 8,
  },
  attack: {
    distance: 40,
    damage: 20,
  },
  attributes: {
    health: 100,
  },
}
