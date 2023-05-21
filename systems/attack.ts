export default class attack {
  process() {
    gworld.entities.forEach((entity, id) => {
      if (!entity.alive || !entity.alive.targetEntityId || !entity.attack) {
        return
      }

      const targetEntity = gworld.entities.get(entity.alive.targetEntityId)
      const distance = glib.distance(entity.position, targetEntity.position)

      if (distance < targetEntity.alive.width / 2 + entity.attack.distance) {
        // 📜 write logic and maybe think about state managment
        // in a different way that is more consise
      }
    })
  }
}
