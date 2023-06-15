export default class damage {
  //
  events: { entityId: number; targetEntityId: number }[] = []

  process() {
    this.events.forEach((event) => {
      const id = event.entityId
      const targetEntityId = event.targetEntityId
      const entity = WORLD.entities.get(id)
      const targetEntity = WORLD.entities.get(targetEntityId)

      const displacement = LIB.vectorFromPoints(
        entity.position,
        entity.alive.targetPosition
      )
      let angle = displacement.angle

      if (id === GLOBAL.heroId) {
        EFFECT_FACTORY.createEffect("sword", targetEntityId, angle)
      }

      if (
        targetEntity.alive.state !== "attack" &&
        targetEntityId !== GLOBAL.heroId
      ) {
        targetEntity.alive.state = "attack"
        targetEntity.alive.targetEntityId = id
        targetEntity.alive.targetAttacked = true
        targetEntity.alive.targetLocked = true
      }
    })

    this.events = []
  }
}
