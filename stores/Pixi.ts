import type { Application } from "pixi.js"
import * as PIXI from "pixi.js"

interface State {
  ticks: number
  app: Application
  containers: {
    [index: string]: any
  }
  sprites: {
    [index: string]: any
  }
}
export const Pixi = defineStore("pixi", {
  state: (): State => ({
    ticks: 0,
    app: new PIXI.Application({
      width: Settings().displayWidth,
      height: Settings().displayHeight,
    }),
    containers: {
      map: new PIXI.Container(),
      sortable: new PIXI.Container(),
      hero: new PIXI.Container(),
    },
    sprites: {
      hero: {},
      maps: {},
    },
  }),
})
