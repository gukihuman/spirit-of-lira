export const Game = defineStore("game", {
  state: () => ({
    frame: 0,
    data: {},
    entities: [],
    entitiesCache: [],
    freeId: 0,
  }),
})
