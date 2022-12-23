export const Game = defineStore("game", {
  state: () => ({
    frame: 0,
    data: {},
    entities: [],
    freeId: 0,
  }),
})
