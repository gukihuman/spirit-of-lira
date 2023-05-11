class Dev {
  init() {
    gpixi.tickerAdd(() => {
      if (gsd.states.devMode) {
        if (gic.keyboard.justPressed.includes("z")) {
          gsignal.emit("collisionEdit")
        }
      }
    }, "gdev")
  }
}
export const gdev = new Dev()
