class Dev {
  init() {
    gp.tickerAdd(() => {
      if (gsd.states.devMode) {
        if (gic.keyboard.justPressed.includes("z")) {
          gsignal.emit("collisionEdit")
        }
        if (gic.keyboard.justPressed.includes("k")) {
          gsignal.emit("collision")
        }
      }
    }, "gdev")
  }
}
export const gdev = new Dev()
