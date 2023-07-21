export default class {
  spawnedChunks: string[] = []
  private spawnPromises: Promise<void>[] = []

  private locationPopulation = {
    greenForestChunks: {
      bunbo: 1,
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
    if (!WORLD.systems.map) return
    WORLD.systems.map.closeChunks?.forEach((chunk) => {
      if (this.spawnedChunks.includes(chunk)) return

      _.forEach(this.locationPopulation, async (spawner, location) => {
        _.forEach(spawner, async (ratio, entity) => {
          this.spawnPromises.push(
            this.createEntitiesOnChunk(
              chunk,
              WORLD.systems.map[location],
              entity,
              ratio
            )
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
      if (WORLD.systems.map.closeChunks.includes(chunk)) return

      WORLD.entities.forEach((entity, id) => {
        const position = entity.position
        if (!position) return

        const entityChunk = LIB.chunkFromCoordinates(position.x, position.y)
        if (entityChunk === chunk) {
          WORLD.entities.delete(id)
          let container = WORLD.getMain(id)
          if (container) WORLD.sortable.removeChild(container)
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

        await ENTITY_FACTORY.create(entity, { position })
        ratio -= 1
      }
    }
  }

  private randomCoordinatesFromChunk(chunk: string, counter: number) {
    let x = LIB.chunkToCoordinateX(chunk)
    let y = LIB.chunkToCoordinateY(chunk)
    x += _.random(0, 999)
    y += _.random(0, 999)

    let tileX = LIB.coordinateToTile(x)
    let tileY = LIB.coordinateToTile(y)

    if (WORLD.systems.collision.collisionArray[tileY][tileX] === 0) {
      return { x, y }
    } else if (counter < 10) {
      counter++
      return this.randomCoordinatesFromChunk(chunk, counter)
    }
  }
}
