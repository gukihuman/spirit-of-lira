type Stamps = { [id: string]: number }
class Time {
  stamps: Stamps = {}
  stamp(duration) {
    const stampId = UNIQUE.string()
    this.stamps.stampId = WORLD.loop.elapsedMS
    return stampId
  }
  process() {}
}
export const TIME = new Time()
