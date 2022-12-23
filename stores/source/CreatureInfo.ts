export const CreatureInfo = defineStore("creatureInfo", {
  state: () => ({
    hero: {
      type: "ally",
      breed: "human",
      maxHealth: 100,
      speed: 14,
    },
    goblin: {
      attitude: "agressive",
      breed: "beastman",
      speed: 8,
      damageMin: 3,
      damageMax: 4,
    },
  }),
})
