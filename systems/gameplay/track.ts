export default class {
  process() {
    WORLD.entities.forEach((entity, id) => {
      if (!entity.state || entity.state.active !== "track") return
      if (!entity.target.id) {
        entity.state.track = false
        return
      }
      entity.move.finaldestination = _.cloneDeep(entity.target.entity.position)
      const skill = entity.skills.data[entity.skills.active]
      if (this.checkDistance(entity, entity.target.entity, skill.distance)) {
        entity.state.cast = true
      }
    })
  }
  private checkDistance(entity, targetEntity, skillDistance) {
    if (!targetEntity) return
    const distance = COORDINATES.distance(
      entity.position,
      targetEntity.position
    )
    return distance - targetEntity.size.width / 2 < skillDistance
  }
}
