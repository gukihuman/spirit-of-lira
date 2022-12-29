import type { Application } from "pixi.js"

interface State {
  app?: Application
}
export const Pixi = defineStore("pixi", {
  state: (): State => ({}),
})
