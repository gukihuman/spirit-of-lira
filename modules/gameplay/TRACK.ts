class Track {
    process() {
        WORLD.entities.forEach((entity, id) => {
            if (!entity.STATE || entity.STATE.active !== "track") return
            if (!entity.TARGET.id) {
                entity.STATE.track = false
                return
            }
            entity.MOVE.final_destination = _.cloneDeep(
                entity.TARGET.entity.POSITION
            )
            const skill = entity.SKILLS.data[entity.SKILLS.active]
            if (this.inRange(entity, skill.distance)) {
                entity.STATE.cast = true
            }
        })
    }
    inRange(entity, skillDistance, multiplier: number = 1) {
        const targetEntity = entity.TARGET.entity
        if (!targetEntity) return
        const weapon = INVENTORY.gear.weapon
        let weaponDistance = 0
        if (entity.HERO)
            weaponDistance = ITEMS.collection.weapons[weapon].distance
        const distance = COORD.distance(entity.POSITION, targetEntity.POSITION)
        return (
            distance - targetEntity.SIZE.width / 2 <
            (skillDistance + weaponDistance) * multiplier
        )
    }
}
export const TRACK = new Track()
