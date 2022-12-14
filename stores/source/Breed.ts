export const Breed = defineStore("breed", {
  state: () => ({
    heroArcher: {
      maxHealth: 100,
      maxMana: 0,
      speed: 14,
      weapon: "woodenBow",
      attackSpeed: 50,
      range: [80, 400],
      damage: [5, 7],
      damageType: "physical",
    },
    goblin: {
      maxHealth: 10,
      maxMana: 0,
      speed: 8,
      weapon: "woodenClub",
      attackSpeed: 50,
      range: [80, 80],
      damage: [3, 4],
      damageType: "physical",
    },
  }),
})
