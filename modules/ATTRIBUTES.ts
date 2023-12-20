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
        MUSEUM.process_entity("ATTRIBUTES", (ent, id) => {
            if (ent.STATE.active === "dead") return
            if (ent.ATTRIBUTES.health < ent.ATTRIBUTES.healthMax) {
                ent.ATTRIBUTES.health +=
                    ent.ATTRIBUTES.healthRegen * LOOP.delta_sec
            }
        })
    }
}
export const ATTRIBUTES = new Attributes()
