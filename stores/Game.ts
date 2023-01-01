interface State {
  activeMaps: string[]
  [index: string]: any
}
export const Game = defineStore("game", {
  state: (): State => ({
    activeMaps: [],
  }),
})
