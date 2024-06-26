class Spawn {
    spawnedChunks: string[] = []
    private spawnPromises: Promise<void>[] = []

    private locationPopulation = {
        greenForestChunks: {
            bunbo: 3,
        },
    }

    async init() {
        await this.spawnEntities()
    }

    process() {
        this.spawnEntities()
        this.despawnEntities()
    }

    private async spawnEntities() {
        MAP.closeChunks?.forEach((chunk) => {
            if (this.spawnedChunks.includes(chunk)) return

            _.forEach(this.locationPopulation, async (spawner, location) => {
                _.forEach(spawner, async (ratio, ent) => {
                    this.spawnPromises.push(
                        this.createEntitiesOnChunk(
                            chunk,
                            MAP[location],
                            ent,
                            ratio
                        )
                    )
                })
                // custom garden bunbo logic
                if (chunk === "0708" && Math.random() < 0.5) {
                    await CREATOR.create("bunbo", {
                        POS: { x: 8799, y: 7659 },
                    })
                }
            })
            this.spawnedChunks.push(chunk)
        })
        await this.spawnPromises.pop()
    }

    private despawnEntities() {
        // despawn far chunks
        this.spawnedChunks.forEach((chunk) => {
            if (MAP.closeChunks.includes(chunk)) return

            WORLD.entities.forEach((ent, id) => {
                if (!ent.MOVE) return
                const POS = ent.POS
                if (!POS) return

                const entityChunk = COORD.chunkFromCoordinates(POS.x, POS.y)
                if (entityChunk === chunk) {
                    WORLD.entities.delete(id)
                    let container = SPRITE.getContainer(id)
                    if (container) WORLD.sortable.removeChild(container)
                }
            })

            _.remove(
                this.spawnedChunks,
                (chunktoDelete) => chunktoDelete === chunk
            )
        })
    }

    private async createEntitiesOnChunk(
        chunk: string,
        locationChunks: string[],
        ent: string,
        ratio: number
    ) {
        if (locationChunks.includes(chunk)) {
            //
            while (ratio > 1 || (ratio > 0 && _.random(1) < ratio)) {
                const counter = 0
                const POS = this.randomCoordinatesFromChunk(chunk, counter)

                // stop loop if POS not found, all tiles in chunks with collision
                if (!POS) return

                await CREATOR.create(ent, { POS: POS })
                ratio -= 1
            }
        }
    }

    private randomCoordinatesFromChunk(chunk: string, counter: number) {
        let x = COORD.chunkToCoordinateX(chunk)
        let y = COORD.chunkToCoordinateY(chunk)
        x += _.random(0, 999)
        y += _.random(0, 999)

        if (COLLISION.is_coord_clear({ x, y })) {
            return { x, y }
        } else if (counter < 10) {
            counter++
            return this.randomCoordinatesFromChunk(chunk, counter)
        }
    }
}
export const SPAWN = new Spawn()
