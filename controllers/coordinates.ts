interface Entity {
  x: number
  y: number
}
class Coordinates {
  ofMapChunk(c: number) {
    return l.floor(c / 1000)
  }
  inMapChunk(c: number) {
    return c % 1000
  }
  mapChunkIndex(entity: Entity) {
    return l.toString(
      this.ofMapChunk(entity.y) * 100 + this.ofMapChunk(entity.x)
    )
  }
  ofTile(c: number) {
    return l.floor(c / 100)
  }
  inTile(c: number) {
    return c % 100
  }
  tileIndex(entity: Entity) {
    return this.ofTile(entity.y) * 1000 + this.ofTile(entity.x)
  }
}
export const c = new Coordinates()
