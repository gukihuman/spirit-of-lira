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
      globalThis.reset = () => {
        SAVE.stringifyLocal("save", SAVE.startSave)
        location.reload()
      }
      globalThis.log = () => {
        return WORLD.hero.position
      }
    }
  }
}
export const DEVMODE = new DevMode()
