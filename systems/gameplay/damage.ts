export default class {
  // rework this
  events: { entityId: number; targetEntityId: number }[] = []
  init() {
    EVENTS.on("damage", (data) => {
      const { entity, targetEntity } = data
      // hit effect

      COORDINATES.angle(entity.position, targetEntity.position)
    })
  }
  process() {
    // rework this
    this.events.forEach((event) => {
      const id = event.entityId
      const targetEntityId = event.targetEntityId
      const entity = WORLD.entities.get(id)
      const targetEntity = WORLD.entities.get(targetEntityId)

      // hit effect
      const displacement = COORDINATES.vectorFromPoints(
        entity.position,
        entity.move.finaldestination
      )
      let angle = displacement.angle
      if (id === WORLD.heroId) {
        EFFECT_FACTORY.create("sword-hit", targetEntityId, angle)
      }

      // attack back
      if (
        targetEntity.state.active !== "attack" &&
        targetEntityId !== WORLD.heroId
      ) {
        targetEntity.state.active = "attack"
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
          entity.state.active = "idle"
          entity.damageDone = false
        }, 500)
      }
    })

    this.events = []
  }
}
