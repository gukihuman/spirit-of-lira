class Attributes {
  component = {
    mood: "peaceful",
    health: 10,
    maxHealth: 10,
    healthRegen: 0,
  }
  process() {
    MUSEUM.processEntity("ATTRIBUTES", (entity, id) => {
      if (entity.ATTRIBUTES.health < entity.ATTRIBUTES.maxHealth) {
        entity.ATTRIBUTES.health +=
          entity.ATTRIBUTES.healthRegen * WORLD.loop.deltaSec
      }
    })
  }
}
export const ATTRIBUTES = new Attributes()
