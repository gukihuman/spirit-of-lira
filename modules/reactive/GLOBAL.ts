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
  contextChangedMS: 0,
  init() {
    WORLD.loop.add(() => {
      if (GLOBAL.context === "world") {
        if (INTERFACE.inventory) GLOBAL.context = "interface"
      }
      if (GLOBAL.context === "interface") {
        if (!INTERFACE.inventory) GLOBAL.context = "world"
      }
    }, "GLOBAL")
    EVENTS.onSingle("contextChanged", () => {
      this.contextChangedMS = WORLD.loop.elapsedMS
    })
  },
}

export const GLOBAL = LIB.store(global)
