class Dev {
  init() {
    gpixi.tickerAdd(() => {
      if (gsd.states.devMode) {
        if (gic.keyboard.justPressed.includes("z")) {
          gsignal.emit("collisionEdit")
        }
        if (gic.keyboard.justPressed.includes("k")) {
          gsignal.emit("collision")
        }
      }
      if (!gg.hero) return
      if (!gg.hero) return
    }, "gdev")
  }
}
export const gdev = new Dev()
