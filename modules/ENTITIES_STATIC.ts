class EntitiesStatic {
    collection = {
        // green-forest
        nighty: {
            POSITION: { x: 6353, y: 6682 },
            TALK: { x: -60, y: -180, distance: 270, scene: "n0" },
        },
        bunny: {
            POSITION: { x: 7880, y: 7408 },
            TALK: { x: -50, y: -220, scene: "a0" },
        },
        "low-tree": { POSITION: { x: 6450, y: 7620 } },
        "low-forest": { POSITION: { x: 7500, y: 9400 } },
        "bridge-fence": { POSITION: { x: 7049, y: 7594 } },
    }
    async init() {
        for (const key in this.collection) {
            await CREATOR.createStatic(key, { SPRITE: {} })
        }
    }
}
export const ENTITIES_STATIC = new EntitiesStatic()
