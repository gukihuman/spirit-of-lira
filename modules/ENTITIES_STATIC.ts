class EntitiesStatic {
    collection = {
        // green-forest
        nighty: {
            POS: { x: 6353, y: 6682 },
            TALK: { x: -60, y: -180, distance: 270, scene: "n0" },
        },
        bunny: {
            POS: { x: 7880, y: 7408 },
            TALK: { x: -50, y: -220, scene: "a0" },
        },
        "low-tree": { POS: { x: 6450, y: 7620 } },
        "low-forest": { POS: { x: 7500, y: 9400 } },
        "bridge-fence": { POS: { x: 7049, y: 7594 } },
    }
    async init() {
        for (const key in this.collection) {
            await CREATOR.createStatic(key, { SPRITE: {} })
        }
    }
}
export const ENTITIES_STATIC = new EntitiesStatic()
