export default class attack {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (
        !entity.alive ||
        !entity.size ||
        !entity.alive.targetEntityId ||
        !entity.attack
      ) {
        return
      }

      const targetEntity = WORLD.entities.get(entity.alive.targetEntityId)
      const distance = LIB.distance(entity.position, targetEntity.position)

      if (distance < targetEntity.size.width / 2 + entity.attack.distance) {
        //
        // 📜 write logic and maybe think about state managment
        // in a different way that is more consise
      }
    })
  }
}
