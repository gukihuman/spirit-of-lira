interface Entity {
  x: number
  y: number
}
class Coordinates {
  ofchunk(c: number) {
    return _.floor(c / 1000)
  }
  inchunk(c: number) {
    return c % 1000
  }
  chunkIndex(entity: Entity) {
    return _.toString(this.ofchunk(entity.y) * 100 + this.ofchunk(entity.x))
  }
  ofTile(c: number) {
    return _.floor(c / 100)
  }
  inTile(c: number) {
    return c % 100
  }
  tileIndex(entity: Entity) {
    return this.ofTile(entity.y) * 1000 + this.ofTile(entity.x)
  }
}
export const c = new Coordinates()
