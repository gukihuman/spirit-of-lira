const global = {
  context: "world",
  gameWindowScale: 1,
  fullscreen: false,
  loading: true,
  devMode: false,
  editMode: false,
  collision: true,
  firstMouseMove: false,
  autoMouseMove: false,
  init() {
    WORLD.loop.add(() => {
      if (GLOBAL.context === "world") {
        if (INTERFACE.inventory) GLOBAL.context = "interface"
      }
      if (GLOBAL.context === "interface") {
        if (!INTERFACE.inventory) GLOBAL.context = "world"
      }
    }, "GLOBAL")
  },
}

export const GLOBAL = LIB.store(global)
