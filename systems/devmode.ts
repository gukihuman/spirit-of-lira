export default class {
  process() {
    if (GLOBAL.devMode) {
      if (INPUT.keyboard.justPressed.includes("z")) {
        EVENTS.emitSingle("collisionEdit")
      }
      if (INPUT.keyboard.justPressed.includes("k")) {
        EVENTS.emitSingle("collision")
      }
      if (INPUT.keyboard.justPressed.includes("l")) {
        console.log(WORLD.hover)
      }
      if (INPUT.keyboard.justPressed.includes("m")) {
        INTERFACE.input = !INTERFACE.input
      }
    }
  }
}
