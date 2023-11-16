const noDamageDistanceMultiplier = 1.1
class Damage {
  deal(entity, id, skill) {
    let damage = skill.damage
    if (entity.HERO) {
      let weaponDamage = 0
      const weapon = INVENTORY.gear.weapon
      if (weapon) weaponDamage = ITEMS.collection.weapons[weapon].damage
      damage = weaponDamage
    }
    entity.TARGET.entity.ATTRIBUTES.health -= damage
    const randomXstart = (Math.random() - 0.5) * 20 // -10 to 10
    const randomYstart = (Math.random() - 0.5) * 10 // -5 to 5
    const randomX = randomXstart * 2 // continue to -20 to 20 in a second
    const randomY = -10 + (Math.random() - 1) * 15 // -10 to -25 in a second
    const hero = entity.TARGET.entity.HERO ? true : false
    let overlay: DamageOverlay = {
      hero,
      damage,
      x: entity.TARGET.entity.POSITION.x + randomXstart,
      y: entity.TARGET.entity.POSITION.y + randomYstart,
      entityHeight: entity.TARGET.entity.SIZE.height,
      // automatically updated in INTERFACE
      screen: { x: 0, y: 0, randomX, randomY, offsetX: 0, offsetY: 0 },
      opacity: 1,
      startMS: LOOP.elapsedMS,
    }
    INTERFACE.damageOverlays.push(overlay)
  }
}
export const DAMAGE = new Damage()
