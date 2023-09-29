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
  mouseOfScreen: { x: 0, y: 0 },
  mousePosition: { x: 0, y: 0 },
  hoverId: undefined,
  process() {
    this.mouseOfScreen = COORDINATES.mouseOfScreen()
    this.mousePosition = COORDINATES.mousePosition()
    if (GLOBAL.context === "world") {
      if (INTERFACE.inventory) GLOBAL.context = "interface"
    }
    if (GLOBAL.context === "interface") {
      if (!INTERFACE.inventory) GLOBAL.context = "world"
    }
  },
}

export const GLOBAL = LIB.store(global)
