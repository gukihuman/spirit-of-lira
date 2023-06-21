export default {
  move: {
    speed: 5,
    destination: undefined,

    // 📜 move to visual cuz non-move might need flip too like projectiles
    // may be not but it seems like better practice
    lastFlipMS: 0,
    randomDestinationMS: 0,

    // 🔧
    depend: ["position"],
    trigger: ["target", "attributes", "shadow", "state"],
    init(entity, id, name, value) {
      entity.move.destination = _.cloneDeep(entity.position)
      entity.move.randomDestinationMS = GPIXI.elapsedMS - 10_000
    },
  },
}
