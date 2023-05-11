export default class Spawn {
  private spawnedChunks: string[] = []
  private counter = 0

  private randomCoordinatesFromMapChunk(mapChunk: string) {
    let x = glib.mapChunkToCoordinateX(mapChunk)
    let y = glib.mapChunkToCoordinateY(mapChunk)
    x += _.random(0, 999)
    y += _.random(0, 999)

    const i = glib.tileIndexFromCoordinates(x, y)

    if (gcm.collisionArray[i] === 0) {
      return { x, y }
    } else if (this.counter < 10) {
      this.counter++
      return this.randomCoordinatesFromMapChunk(mapChunk)
    }
  }

  process() {
    gmm.loadedChunks.forEach((value, mapChunk) => {
      if (this.spawnedChunks.includes(mapChunk)) return
      this.spawnedChunks.push(mapChunk)

      if (gmm.greenForestCnunks.includes(mapChunk)) {
        //
        let ratio = 0.2
        while (ratio > 1) {
          const position = this.randomCoordinatesFromMapChunk(mapChunk)
          if (!position) return
          gef.createEntity("bunbo", { position })
          ratio -= 1
        }

        if (_.random(1) < ratio) {
          const position = this.randomCoordinatesFromMapChunk(mapChunk)
          if (!position) return
          console.log(position)
          gef.createEntity("bunbo", { position })
        }
      }
    })
  }
}
