import type { Application } from "pixi.js"

interface State {
  app: Application | null
  assets: {
    [index: string]: any
  }
  sprites: {
    [index: string]: any
  }
}
export const Pixi = defineStore("pixi", {
  state: (): State => ({
    app: null,
    assets: {},
    sprites: {},
  }),
})
