import { handleError } from "nuxt/dist/app/compat/capi"

class DevMode {
  init() {
    GPIXI.tickerAdd(() => {
      if (REACTIVE.states.devMode) {
        if (INPUT.keyboard.justPressed.includes("z")) {
          SIGNAL.emit("collisionEdit")
        }
        if (INPUT.keyboard.justPressed.includes("k")) {
          SIGNAL.emit("collision")
        }
        if (INPUT.keyboard.justPressed.includes("l")) {
          console.log(REACTIVE.world.hover)
        }
      }
    }, "DEV_MODE")
  }
}
export const DEV_MODE = new DevMode()
