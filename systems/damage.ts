export default class damage {
  //
  events: { entityId: number; targetEntityId: number }[] = []

  process() {
    this.events.forEach((event) => {
      const id = event.entityId
      const targetEntityId = event.targetEntityId
      const entity = WORLD.entities.get(id)
      const targetEntity = WORLD.entities.get(targetEntityId)

      // hit effect
      const displacement = LIB.vectorFromPoints(
        entity.position,
        entity.move.destination
      )
      let angle = displacement.angle
      if (id === SYSTEM_DATA.world.heroId) {
        EFFECT_FACTORY.createEffect("sword-hit", targetEntityId, angle)
      }

      // attack back
      if (
        targetEntity.state.main !== "attack" &&
        targetEntityId !== SYSTEM_DATA.world.heroId
      ) {
        targetEntity.state.main = "attack"
        targetEntity.target.id = id
        targetEntity.target.attacked = true
        targetEntity.target.locked = true
      }

      targetEntity.attributes.health -= entity.attack.damage
      if (targetEntity.attributes.health <= 0) {
        setTimeout(() => {
          entity.target.id = undefined
          entity.target.locked = false
          entity.target.attacked = false
          entity.target.entity = undefined
          entity.state.main = "idle"
          entity.move.destination = entity.position
          entity.damageDone = false
        }, 500)
      }
    })

    this.events = []
  }
}
