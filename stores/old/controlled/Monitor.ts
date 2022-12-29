interface State {
  gameLoop: number[]
}

export const Monitor = defineStore("monitor", {
  state: (): State => ({
    gameLoop: [],
  }),
})
