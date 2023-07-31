export default {
  damage: 0,
  manacost: 0,
  distance: 50,
  castTimeMS: 1000,
  firstCastMS: 1000,
  delayMS: 200,
  logic(entity, targetEntity) {
    if (entity.name === "lira") {
      let weaponDamage = 0
      const weapon = INVENTORY.equipped.weapon
      if (weapon) weaponDamage = ITEMS.weapons[weapon].damage
      targetEntity.attributes.health -= weaponDamage
      return
    }
    targetEntity.attributes.health -= entity.skill.attack.damage
  },
}
