export default class spawn {
  private spawnedChunks: string[] = []
  private spawnPromises: Promise<void>[] = []

  private locationPopulation = {
    greenForestChunks: {
      bunbo: 2,
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
    gmm.closeChunks.forEach((chunk) => {
      if (this.spawnedChunks.includes(chunk)) return

      _.forEach(this.locationPopulation, async (spawner, location) => {
        _.forEach(spawner, async (ratio, entity) => {
          this.spawnPromises.push(
            this.createEntitiesOnChunk(chunk, gmm[location], entity, ratio)
          )
        })
      })
      this.spawnedChunks.push(chunk)
    })
    await this.spawnPromises.pop()
  }

  private despawnEntities() {
    // despawn far chunks
    this.spawnedChunks.forEach((chunk) => {
      if (gmm.closeChunks.includes(chunk)) return

      gworld.entities.forEach((entity, id) => {
        const position = entity.position
        if (!position) return

        const entityChunk = glib.chunkFromCoordinates(position.x, position.y)
        if (entityChunk === chunk) {
          gworld.entities.delete(id)
          let container = gpixi.getContainer(id)
          if (container) gpixi.sortable.removeChild(container)
        }
      })

      _.remove(this.spawnedChunks, (chunktoDelete) => chunktoDelete === chunk)
    })
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

        // stop loop if position not found, all tiles in chunks with collision
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
