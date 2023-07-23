export default {
  // 📜 move to attributes
  speed: 5,

  destination: undefined,
  finaldestination: undefined,
  path: [],

  // 📜 change name of speed per tick
  // arrays hold 30 frames, used to precisely change walk / run
  lastFramesDistance: [],
  lastFramesSpeedPerTick: [],

  // mean of corresponding arrays
  lastAverageDistance: 0,
  lastAverageSpeedPerTick: 0,

  randomDestinationMS: 0,
  setMousePointOnWalkableMS: 0,

  // 🔧
  depend: ["position"],
  trigger: ["target", "attributes", "shadow", "state"],
  inject(entity, id) {
    entity.move.finaldestination = _.cloneDeep(entity.position)
    entity.move.randomDestinationMS = WORLD.loop.elapsedMS - 10_000
  },
}
