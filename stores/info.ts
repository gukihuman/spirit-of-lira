declare global {
  export interface ItemInfo {
    name: string
  }
  interface MapInfo {
    name: string
    place: [number, number]
    collision: (0 | 1 | 2 | 3)[]
  }
}
interface State {
  items: ItemInfo[]
  maps: MapInfo[]
}
export const Info = defineStore("info", {
  state: (): State => ({
    items: [],
    maps: [
      {
        name: "greenForest",
        place: [0, 0],
        collision: new Array(60 * 60).fill(0),
      },
      {
        name: "yellowForest",
        place: [1, 0],
        collision: new Array(60 * 60).fill(0),
      },
      {
        name: "violetForest",
        place: [0, -1],
        collision: new Array(60 * 60).fill(0),
      },
      {
        name: "redForest",
        place: [-1, 0],
        collision: new Array(60 * 60).fill(0),
      },
      {
        name: "blueForest",
        place: [-1, -1],
        collision: new Array(60 * 60).fill(0),
      },
    ],
  }),
})
