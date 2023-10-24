class InputUpdate {
  init() {
    INPUT.init(REFS.viewport) // input controller
  }
  process() {
    INPUT.update()
    // watch first mouse move (or double click)
    // to prevent movement to the 0 0 coordinates
    if (!GLOBAL.firstMouseMove) {
      if (INPUT.mouse.x !== 0 || INPUT.mouse.y !== 0) {
        GLOBAL.firstMouseMove = true
      }
    }
    GLOBAL.lastActiveDevice = INPUT.lastActiveDevice
  }
}
export const INPUT_UPDATE = new InputUpdate()
