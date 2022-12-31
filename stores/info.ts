declare global {
  interface ItemInfo {}
  interface MapInfo {
    place: [number, number]
    collision: (0 | 1 | 2 | 3)[]
  }
}
interface State {
  hero: {
    [index: string]: any
  }
  items: {
    [index: string]: ItemInfo
  }
  maps: {
    [index: string]: MapInfo
  }
}
export const Info = defineStore("info", {
  state: (): State => ({
    hero: {
      json: new URL("/assets/hero/hero.json", import.meta.url).href,
    },
    items: {},
    maps: {
      greenForest: {
        place: [0, 0],
        collision: new Array(60 * 60).fill(0),
      },
      yellowForest: {
        place: [1, 0],
        collision: new Array(60 * 60).fill(0),
      },
      violetForest: {
        place: [0, -1],
        collision: new Array(60 * 60).fill(0),
      },
      redForest: {
        place: [-1, 0],
        collision: new Array(60 * 60).fill(0),
      },
      blueForest: {
        place: [-1, -1],
        collision: new Array(60 * 60).fill(0),
      },
    },
  }),
})
