class Map {
  readonly size: number
  x: number
  y: number
  url: string

  constructor(mapName: string, name: string, x: number, y: number) {
    this.size = 2400
    this.x = x * this.size
    this.y = y * this.size
    this.url = new URL(
      `/assets/maps/${mapName}/${name}.webp`,
      import.meta.url
    ).href
  }
}
export const Info = defineStore("info", {
  state: () => ({
    hero: {},
  }),
})
