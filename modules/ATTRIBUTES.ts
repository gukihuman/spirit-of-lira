class Attributes {
    component = {
        mood: "peaceful",
        health: 10,
        healthMax: 10,
        healthRegen: 0,
        energy: 10,
        energyMax: 10,
        energyRegen: 0,
        attackSpeed: 1, // work only for animations for now :)
    }
    process() {
        MUSEUM.process_entity("ATTRIBUTES", (entity, id) => {
            if (entity.STATE.active === "dead") return
            if (entity.ATTRIBUTES.health < entity.ATTRIBUTES.healthMax) {
                entity.ATTRIBUTES.health +=
                    entity.ATTRIBUTES.healthRegen * LOOP.delta_sec
            }
        })
    }
}
export const ATTRIBUTES = new Attributes()
