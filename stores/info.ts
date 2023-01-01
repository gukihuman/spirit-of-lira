declare global {
  interface ItemInfo {}
}
interface State {
  hero: {
    [index: string]: any
  }
  items: {
    [index: string]: ItemInfo
  }
  maps: any
}
class Map {
  readonly size: number
  x: number
  y: number
  collision: number[]
  url: string

  constructor(mapName: string, name: string, x: number, y: number) {
    this.size = 2400
    this.x = x * this.size
    this.y = y * this.size
    this.collision = new Array(20 * 20).fill(0)
    this.url = new URL(
      `/assets/maps/${mapName}/${name}.webp`,
      import.meta.url
    ).href
  }
}
function createMapSet(options: any) {
  let mapSet: any = {}
  l.forOwn(options, (value, mapName) => {
    let x = value[0]
    let y = value[1]
    x *= 3
    y *= 3
    for (let i of l.range(9)) {
      let name = mapName + "_00" + (i + 1)
      mapSet[name] = new Map(mapName, name, (i % 3) + x, Math.floor(i / 3) + y)
    }
  })
  return mapSet
}
export const Info = defineStore("info", {
  state: (): State => ({
    hero: {
      json: new URL("/assets/hero/hero.json", import.meta.url).href,
    },
    items: {},
    maps: createMapSet({ greenForest: [0, 0], yellowForest: [-1, 0] }),
  }),
})
