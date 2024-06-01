class EntitiesStatic {
    collection = {
        // green-forest
        nighty: {
            POS: { x: 6353, y: 6682 },
            // TALK: { x: -65, y: -200, distance: 320, scene: "n1-start" },
        },
        bunny: {
            POS: { x: 7880, y: 7408 },
            // TALK: { x: -65, y: -300, scene: "b1-start" },
        },
        hermione: {
            POS: { x: 7480, y: 5608 },
            TALK: { x: -65, y: -150, scene: "h1-start" },
        },
        "low-tree": { POS: { x: 6450, y: 7620 } },
        "low-forest": { POS: { x: 7500, y: 9400 } },
        bridge: { POS: { x: 7142, y: 7074 } },
        "bridge-fence": { POS: { x: 7047, y: 7578 } },
        "bridge-fence-top": { POS: { x: 7272, y: 7176 } },
        "bunny-tree": { POS: { x: 7775, y: 7290 } },
        "river-low-tree": { POS: { x: 6775, y: 7915 } },
        "tree-low-cave": { POS: { x: 7000, y: 9220 } },
        "close-sign": { POS: { x: 8970, y: 8300 } },
    }
    async init() {
        for (const key in this.collection) {
            await CREATOR.createStatic(key, { SPRITE: {} })
        }
    }
}
export const ENTITIES_STATIC = new EntitiesStatic()
