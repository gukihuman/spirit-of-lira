const global = {
  version: "0.1.0",
  gameWindowScale: 1,
  fullscreen: false,
  loading: true,
  devMode: false,
  editMode: false,
  collision: true,
  firstMouseMove: false,
  autoMove: false,
  sceneContextChangedMS: 0,
  firstUserGesture: false,
  mouseOfScreen: { x: -30, y: -30 },
  mousePosition: { x: -30, y: -30 },
  hoverId: undefined,
  lastActiveDevice: "keyboard",
  elapsedMS: 0,
  process() {
    this.elapsedMS = LOOP.elapsedMS
    this.mouseOfScreen = COORD.mouseOfScreen()
    this.mousePosition = COORD.mousePosition()
  },
}

export const GLOBAL = LIBRARY.resonateObject(global)
