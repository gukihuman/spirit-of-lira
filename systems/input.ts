export default class {
  init() {
    INPUT.init(SYSTEM_DATA.refs.viewport) // input controller
  }

  process() {
    INPUT.update()

    // watch first mouse move (or double click)
    // to prevent movement to the 0 0 coordinates
    if (!SYSTEM_DATA.states.firstMouseMove) {
      if (INPUT.mouse.x !== 0 || INPUT.mouse.y !== 0) {
        SYSTEM_DATA.states.firstMouseMove = true
      }
    }
  }
}
