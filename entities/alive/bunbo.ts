export default {
  size: {
    width: 70,
    height: 60,
  },
  sprite: {
    leaveAnimationConditions: {
      move: (entity, id) => {
        return SPRITE.getAnimation(id, "move")?.currentFrame === 0
      },
    },
    startFrames: { attack: 18 },
  },
  move: {
    speed: 8,
  },
  skill: {
    attack: {
      damage: 2,
      castTimeMS: 2400,
      firstCastMS: 1800,
    },
  },
  attributes: {
    health: 10,
  },
  state: {
    deadTimeMS: 1300,
  },
}
