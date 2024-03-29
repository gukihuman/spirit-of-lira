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
      if (this.inRange(entity, id, entity.target.entity, skill.distance)) {
        entity.state.cast = true
      }
    })
  }
  private inRange(entity, id, targetEntity, skillDistance) {
    if (!targetEntity) return
    const weapon = INVENTORY.equipped.weapon
    let weaponDistance = 0
    if (LIB.hero(id)) weaponDistance = ITEMS.weapons[weapon].distance
    const distance = COORDINATES.distance(
      entity.position,
      targetEntity.position
    )
    return (
      distance - targetEntity.size.width / 2 < skillDistance + weaponDistance
    )
  }
}
