class Ma {
    chunkSprites: Map<string, Sprite> = new Map()
    closeChunks: string[] = []
    greenForestChunks: string[] = this.setLocationChunks(5, 9)
    /** @returns square of chunks, for example for 50 and 51 ["5050", "5051", "5150", "5151"] */
    private setLocationChunks(start: number, end: number) {
        const chunks: string[] = []
        for (let y = start; y <= end; y++) {
            for (let x = start; x <= end; x++) {
                let stringX = `${x}`
                if (stringX.length === 1) stringX = `0${stringX}`
                let stringY = `${y}`
                if (stringY.length === 1) stringY = `0${stringY}`
                chunks.push(`${stringY}${stringX}`)
            }
        }
        return chunks
    }
    async init() {
        await this.loadCloseChunks()
    }
    process() {
        this.loadCloseChunks()
        this.preloadCloseChunksOnDead()
        const heroPOS = HERO.ent.POS
        if (!heroPOS) return
        // update coordinates
        this.chunkSprites.forEach((sprite, chunk) => {
            if (!heroPOS.x || !heroPOS.y) return
            sprite.x =
                COORD.chunkToCoordinateX(chunk) +
                CONFIG.viewport.width / 2 -
                heroPOS.x
            sprite.y =
                COORD.chunkToCoordinateY(chunk) +
                CONFIG.viewport.height / 2 -
                heroPOS.y
        })
    }
    private async preloadCloseChunksOnDead() {
        if (HERO.ent.STATE.active === "dead") {
            const custom_center = _.cloneDeep(ENTITIES.collection.lira.POS)
            this.loadCloseChunks(custom_center)
        }
    }
    private async loadCloseChunks(
        custom_center: { x: number; y: number } | undefined = undefined
    ) {
        if (!HERO.ent) return
        let heroPOS = HERO.ent.POS
        if (custom_center) heroPOS = custom_center
        const startY = COORD.coordinateToChunk(heroPOS.y) - 1
        const startX = COORD.coordinateToChunk(heroPOS.x) - 2
        if (!custom_center) this.closeChunks = []
        const sprites: Promise<void>[] = []
        for (let y of _.range(startY, startY + 3)) {
            for (let x of _.range(startX, startX + 5)) {
                let stringX = `${x}`
                if (stringX.length === 1) stringX = `0${stringX}`
                let stringY = `${y}`
                if (stringY.length === 1) stringY = `0${stringY}`
                const chunk = `${stringY}${stringX}`
                this.closeChunks.push(chunk)
                sprites.push(this.loadChunkSprite(chunk))
            }
        }
        await Promise.all(sprites)
    }
    private async loadChunkSprite(index: string) {
        if (this.chunkSprites.get(index)) return
        // immideately adds index to the map to prevent duplicates
        // before Sprite is actually loaded using await later
        this.chunkSprites.set(index, new PIXI.Sprite())
        let webp = ASSETS.webp_paths[index]
        if (!webp) webp = ASSETS.get_webp_path("map-not-found")
        if (!webp) return
        const texture = await PIXI.Assets.load(webp)
        const sprite = new PIXI.Sprite(texture)
        sprite.cullable = true
        WORLD.map.addChild(sprite)
        this.chunkSprites.set(index, sprite)
    }
}
export const MAP = new Ma()
