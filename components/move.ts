export default {
  // 📜 move to attributes
  speed: 5,

  destination: undefined,
  finaldestination: undefined,
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
