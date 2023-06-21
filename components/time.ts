export default {
  durationMS: Infinity, // self destruct after creation in this time

  // 🔧
  autoInject: true,
  creationMS: 0,
  init(entity, id, name, value) {
    entity.time.creationMS = GPIXI.elapsedMS
  },
}
