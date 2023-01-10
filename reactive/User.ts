const rawUser = {
  data: {
    hero: genEntity(info.hero, { x: 51000, y: 54000 }),
  },
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
export const User: any = defineStore("user", () => {
  const state = l.mapValues(rawUser, (key) => reactive(key))
  return state
})
