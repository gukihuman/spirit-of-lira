export default {
  durationMS: Infinity, // self destruct after creation in this time
  deathTimerStartMS: 0,

  // 🔧
  autoInject: true,
  inject(entity, id) {
    entity.time.deathTimerStartMS = WORLD.elapsedMS
  },
}
