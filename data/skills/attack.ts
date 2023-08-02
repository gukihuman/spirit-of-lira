export default {
  damage: 1,
  manacost: 0,
  distance: 50,
  castMS: 1000,
  firstCastMS: 1000,
  delayMS: 200,
  logic(entity, id) {
    if (!entity.target.id) return
    // 📜 move to any offensive skill
    EVENTS.emit("revenge", {
      entity: entity.target.entity,
      id: entity.target.id,
      offender: entity,
      offenderId: id,
    })
    if (LIB.hero(id)) {
      let weaponDamage = 0
      const weapon = INVENTORY.equipped.weapon
      if (weapon) weaponDamage = ITEMS.weapons[weapon].damage
      entity.target.entity.attributes.health -= weaponDamage
    } else {
      entity.target.entity.attributes.health -= entity.skills.data.attack.damage
      console.log(entity.target.entity.attributes.health)
    }
    if (entity.target.entity.attributes.health <= 0) {
      entity.target.id = undefined
      WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
    }
  },
}
