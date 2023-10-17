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
      if (INPUT.keyboard.justPressed.includes("m")) {
        INTERFACE.input = !INTERFACE.input
      }
      globalThis.resetProgress = () => {
        PROGRESS.scenes = []
        LOCAL.update()
        location.reload()
      }
      globalThis.log = () => {
        console.log(SCENE.steps["s0-adult-check"])
      }
    }
  }
}
export const DEVMODE = new DevMode()
