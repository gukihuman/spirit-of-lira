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
  skills: {
    modify: {
      attack: {
        distance: 40,
        damage: 2,
        castMS: 2200,
        firstCastMS: 1400,
      },
    },
  },
  attributes: {
    health: 10,
  },
  state: {
    deadDelayMS: 1300,
  },
}
