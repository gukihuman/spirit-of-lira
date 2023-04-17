const rawUser = {
  data: {
    hero: genEntity(info.hero, { x: 51000, y: 54000 }),
  },
  settings: {
    board: {
      tap: {
        heroMove: "i",
        fullscreen: "a",
      },
      hold: { heroMove: "o" },
    },
    mouse: {
      tap: {},
      hold: { heroMove: 0 },
    },
    pad: {
      deadZone: 0.15,
      tap: { fullscreen: "Start" },
      hold: {},
    },
  },
}
export const User: any = defineStore("user", () => {
  const state = _.mapValues(rawUser, (key) => reactive(key))
  return state
})
