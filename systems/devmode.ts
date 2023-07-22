export default class {
  process() {
    if (STATES.devMode) {
      if (INPUT.keyboard.justPressed.includes("z")) {
        EVENTS.emit("collisionEdit")
      }
      if (INPUT.keyboard.justPressed.includes("k")) {
        EVENTS.emit("collision")
      }
      if (INPUT.keyboard.justPressed.includes("l")) {
        console.log(STATES.hover)
      }
      if (INPUT.keyboard.justPressed.includes("m")) {
        STATES.input = !STATES.input
      }
    }
  }
}
