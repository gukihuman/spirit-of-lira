type Timestamp = {}
type Stamps = {
  [id: string]: Timestamp
}
class Time {
  stamps: Stamps = {}
  stamp(duration) {
    const stampId = UNIQUE.string()
    this.stamps.stampId
    return stampId
  }
  process() {}
}
export const TIME = new Time()
