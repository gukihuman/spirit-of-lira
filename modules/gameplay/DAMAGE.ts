class Damage {
    deal(ent, id, skill) {
        let damage = skill.damage
        if (ent.HERO) {
            let weaponDamage = 0
            const weapon = INVENTORY.gear.weapon
            if (weapon) weaponDamage = ITEMS.collection.weapons[weapon].damage
            damage = weaponDamage
        }
        ent.TARGET.ent.ATTRIBUTES.health -= damage
        const randomXstart = (Math.random() - 0.5) * 20 // -10 to 10
        const randomYstart = (Math.random() - 0.5) * 6 // -3 to 3
        const randomX = randomXstart * 1.5 // continue to -15 to 15 in a second
        // y is always the lower - the highter
        const randomY = -5 + (Math.random() - 1) * 5 // -5 to -10 in a second
        const hero = ent.TARGET.ent.HERO ? true : false
        let overlay: DamageOverlay = {
            hero,
            damage,
            x: ent.TARGET.ent.POS.x + randomXstart,
            y: ent.TARGET.ent.POS.y + randomYstart,
            entityHeight: ent.TARGET.ent.SIZE.height,
            // automatically updated in INTERFACE
            screen: {
                x: 0,
                y: 0,
                randomX,
                randomY,
                offsetX: 0,
                offsetY: 0,
                scale: 2.2,
                opacity: 0,
            },
            startMS: LOOP.elapsed,
        }
        INTERFACE.damageOverlays.push(overlay)
    }
}
export const DAMAGE = new Damage()
