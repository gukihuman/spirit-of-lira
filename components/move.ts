export default {
  speed: 5,

  destination: null,
  finaldestination: null,
  path: [],

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
