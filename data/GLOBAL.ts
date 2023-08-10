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
      if (INTERFACE.inventory) GLOBAL.context = "interface"
      // implemet handle context
      else GLOBAL.context = "scene"
    }, "GLOBAL")
  },
}

export const GLOBAL = LIB.store(global)
