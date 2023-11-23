class DevMode {
  process() {
    if (GLOBAL.devMode) {
      if (INPUT.keyboard.justPressed.includes("z")) {
        EVENTS.emitSingle("toggleEditMode")
      }
      if (INPUT.keyboard.justPressed.includes("k")) {
        EVENTS.emitSingle("toggleCollision")
      }
      if (INPUT.keyboard.justPressed.includes("l")) {
        console.log(WORLD.hover)
      }
      globalThis.reset = () => SAVE.reset()
      globalThis.log = () => {
        return INTERFACE.damageOverlays
      }
    }
  }
}
export const DEVMODE = new DevMode()
