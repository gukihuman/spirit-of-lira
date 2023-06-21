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
        entity.move.destination
      )
      let angle = displacement.angle

      if (id === GLOBAL.heroId) {
        EFFECT_FACTORY.createEffect("sword", targetEntityId, angle)
      }

      if (
        targetEntity.move.state !== "attack" &&
        targetEntityId !== GLOBAL.heroId
      ) {
        targetEntity.move.state = "attack"
        targetEntity.target.id = id
        targetEntity.target.attacked = true
        targetEntity.target.locked = true
      }
    })

    this.events = []
  }
}
