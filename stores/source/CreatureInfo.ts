export const CreatureInfo = defineStore("creatureInfo", {
  state: () => ({
    hero: {
      type: "ally", // delete
      attitude: "peaceful",
      size: 40, // delete
      breed: "human",
      maxHealth: 100,
      maxMana: 0,
      speed: 14,
      attackSpeed: 50, // delete
      damageMin: 1,
      damageMax: 2,
      damageType: "physical", // delete
      range: 500, // delete
    },
    goblin: {
      type: "enemy", // delete
      attitude: "agressive",
      size: 40, // delete
      breed: "beastman",
      maxHealth: 10,
      maxMana: 0,
      speed: 8,
      attackSpeed: 50, // delete
      damageMin: 3,
      damageMax: 4,
      damageType: "physical", // delete
      range: 80, // delete
    },
  }),
})
