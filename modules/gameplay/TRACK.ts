class Track {
    process() {
        WORLD.entities.forEach((ent, id) => {
            if (!ent.STATE || ent.STATE.active !== "track") return
            if (!ent.TARGET.id) {
                ent.STATE.track = false
                return
            }
            ent.MOVE.des = _.cloneDeep(ent.TARGET.ent.POS)
            ent.MOVE.final_des = _.cloneDeep(ent.TARGET.ent.POS)
            const skill = ent.SKILLS.data[ent.SKILLS.active]
            if (this.inRange(ent, skill.distance)) {
                ent.STATE.cast = true
            }
        })
    }
    inRange(ent, skillDistance, multiplier: number = 1) {
        const targetEntity = ent.TARGET.ent
        if (!targetEntity) return
        const weapon = INVENTORY.gear.weapon
        let weaponDistance = 0
        if (ent.HERO) weaponDistance = ITEMS.collection.weapons[weapon].distance
        const distance = COORD.distance(ent.POS, targetEntity.POS)
        return (
            distance - targetEntity.SIZE.width / 2 <
            (skillDistance + weaponDistance) * multiplier
        )
    }
}
export const TRACK = new Track()
