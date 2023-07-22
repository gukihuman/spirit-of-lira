export default class {
  process() {
    if (SYSTEM_DATA.states.devMode) {
      if (INPUT.keyboard.justPressed.includes("z")) {
        EVENTS.emit("collisionEdit")
      }
      if (INPUT.keyboard.justPressed.includes("k")) {
        EVENTS.emit("collision")
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
