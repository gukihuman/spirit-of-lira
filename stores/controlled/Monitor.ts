interface Monitor {
  gameLoop: number[]
}

export const Monitor = defineStore("monitor", {
  state: (): Monitor => ({
    gameLoop: [],
  }),
})
