export const EntityInfo = defineStore("entityInfo", {
  state: () => ({
    hero: {
      type: "peaceful",
      size: 70,
      breed: "human",
      maxHealth: 100,
      maxMana: 0,
      speed: 14,
      attackSpeed: 50,
      damage: [1, 2],
      damageType: "physical",
      range: 350,
    },
    goblin: {
      type: "enemy",
      size: 55,
      breed: "beastman",
      maxHealth: 10,
      maxMana: 0,
      speed: 8,
      attackSpeed: 50,
      damage: [3, 4],
      damageType: "physical",
      range: 110,
    },
  }),
})
