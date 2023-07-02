export default {
  speed: 5,
  destination: undefined,

  randomDestinationMS: 0,

  // 🔧
  depend: ["position"],
  trigger: ["target", "attributes", "shadow", "state"],
  inject(entity, id) {
    entity.move.destination = _.cloneDeep(entity.position)
    entity.move.randomDestinationMS = GPIXI.elapsedMS - 10_000
  },
}
