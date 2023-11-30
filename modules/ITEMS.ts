class Items {
  collection = {
    clothes: {},
    weapons: {
      "common-sword": {
        sprite: "attack-sword",
        audio: "sword-hit",
        audioDelay: 0.8, // multiplier on the cast time
        hitEffect: "sword-hit",
        distance: 20,
        damage: 3,
      },
    },
  }
}
export const ITEMS = new Items()
