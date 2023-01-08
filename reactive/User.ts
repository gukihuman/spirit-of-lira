const rawUser = {
  data: {},
  settings: {
    control: {
      gamepad: {
        deadZone: 0.15,
        fullscreen: "Start",
      },
      keyboard: {
        heroMove: "o",
        autoHeroMove: "i",
        fullscreen: "a",
        collisionEdit: "m",
      },
      mouse: {
        heroMove: 0,
      },
    },
  },
}
export const User = defineStore("user", () => {
  const state = l.mapValues(rawUser, (state) => reactive(state))

  return state
})
