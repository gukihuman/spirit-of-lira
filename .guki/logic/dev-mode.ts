class DevMode {
  init() {
    PIXI_GUKI.tickerAdd(() => {
      if (SYSTEM_DATA.states.devMode) {
        if (INPUT.keyboard.justPressed.includes("z")) {
          SIGNAL.emit("collisionEdit")
        }
        if (INPUT.keyboard.justPressed.includes("k")) {
          SIGNAL.emit("collision")
        }
        if (INPUT.keyboard.justPressed.includes("l")) {
          console.log(GLOBAL.hover)
        }
      }
    }, "DEV_MODE")
  }
}
export const DEV_MODE = new DevMode()
