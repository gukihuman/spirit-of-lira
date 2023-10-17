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
  sceneContextChangedMS: 0,
  firstUserGesture: false,
  mouseOfScreen: { x: -30, y: -30 },
  mousePosition: { x: -30, y: -30 },
  hoverId: undefined,
  process() {
    this.mouseOfScreen = COORDS.mouseOfScreen()
    this.mousePosition = COORDS.mousePosition()
    if (GLOBAL.context === "world") {
      if (INTERFACE.inventory) GLOBAL.context = "interface"
    }
    if (GLOBAL.context === "interface") {
      if (!INTERFACE.inventory) GLOBAL.context = "world"
    }
  },
}

export const GLOBAL = LIB.store(global)
