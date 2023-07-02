export default class {
  process() {
    if (SYSTEM_DATA.states.devMode) {
      if (INPUT.keyboard.justPressed.includes("z")) {
        SIGNAL.emit("collisionEdit")
      }
      if (INPUT.keyboard.justPressed.includes("k")) {
        SIGNAL.emit("collision")
      }
      if (INPUT.keyboard.justPressed.includes("l")) {
        console.log(SYSTEM_DATA.world.hover)
      }
      if (INPUT.keyboard.justPressed.includes("m")) {
        SYSTEM_DATA.states.input = !SYSTEM_DATA.states.input
      }
    }
  }
}
