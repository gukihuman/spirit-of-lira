export default class Spawn {
  private spawnedChunks: string[] = []

  private locationPopulation = {
    greenForestChunks: {
      bunbo: 2,
    },
  }

  process() {
    this.spawnEntities()

    // despawn far chunks
    this.spawnedChunks.forEach((chunk) => {
      if (gmm.closeChunks.includes(chunk)) return

      gworld.entities.forEach((entity, id) => {
        const position = entity.get("position")
        // console.log(position)
        if (!position) return

        const entityChunk = glib.chunkFromCoordinates(position.x, position.y)
        if (entityChunk === chunk) gworld.entities.delete(id)
      })

      _.remove(this.spawnedChunks, (chunktoDelete) => chunktoDelete === chunk)
    })
  }

  async init() {
    await this.spawnEntities()
  }

  private async spawnEntities() {
    const promises: Promise<void>[] = []
    gmm.closeChunks.forEach((chunk) => {
      if (this.spawnedChunks.includes(chunk)) return
      this.spawnedChunks.push(chunk)

      _.forEach(this.locationPopulation, async (spawner, location) => {
        _.forEach(spawner, async (ratio, entity) => {
          promises.push(
            this.createEntitiesOnChunk(chunk, gmm[location], entity, ratio)
          )
        })
      })
    })
    await Promise.all(promises)
  }

  private async createEntitiesOnChunk(
    chunk: string,
    locationChunks: string[],
    entity: string,
    ratio: number
  ) {
    if (locationChunks.includes(chunk)) {
      //
      while (ratio > 1 || (ratio > 0 && _.random(1) < ratio)) {
        const counter = 0
        const position = this.randomCoordinatesFromChunk(chunk, counter)

        // stor loop if position not found, all liles in chunks are collisioned
        if (!position) return

        await gef.createEntity(entity, { position })
        ratio -= 1
      }
    }
  }

  private randomCoordinatesFromChunk(chunk: string, counter: number) {
    let x = glib.chunkToCoordinateX(chunk)
    let y = glib.chunkToCoordinateY(chunk)
    x += _.random(0, 999)
    y += _.random(0, 999)

    const i = glib.tileIndexFromCoordinates(x, y)

    if (gcm.collisionArray[i] === 0) {
      return { x, y }
    } else if (counter < 10) {
      counter++
      return this.randomCoordinatesFromChunk(chunk, counter)
    }
  }
}
