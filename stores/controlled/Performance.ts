export const Performance = defineStore("performance", {
  state: () => ({
    startFrame: 0,
    endFrame: 0,
    startGameLoop: 0,
    endGameLoop: 0,
    display: 0,
  }),
})
