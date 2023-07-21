export default class {
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
        entity.move.finaldestination
      )
      let angle = displacement.angle
      if (id === SYSTEM_DATA.world.heroId) {
        EFFECT_FACTORY.create("sword-hit", targetEntityId, angle)
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
        entity.target.id = undefined
        entity.target.locked = false
        entity.target.attacked = false
        entity.target.entity = undefined
        entity.move.finaldestination = _.cloneDeep(entity.position)
        setTimeout(() => {
          entity.state.main = "idle"
          entity.damageDone = false
        }, 500)
      }
    })

    this.events = []
  }
}
