class Attributes {
  component = {
    mood: "peaceful",
    health: 10,
    maxHealth: 10,
    healthRegen: 0,
    mana: 10,
    maxEnergy: 10,
    manaRegen: 0,
  }
  process() {
    MUSEUM.processEntity("ATTRIBUTES", (entity, id) => {
      if (entity.STATE.active === "dead") return
      if (entity.ATTRIBUTES.health < entity.ATTRIBUTES.maxHealth) {
        entity.ATTRIBUTES.health +=
          entity.ATTRIBUTES.healthRegen * LOOP.deltaSec
      }
    })
  }
}
export const ATTRIBUTES = new Attributes()
