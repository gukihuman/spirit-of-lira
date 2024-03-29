class Effects {
  front = {
    "sword-hit": 500,
    "bunbo-bite": 500,
  }
  back = {}
  init() {
    WORLD.loop.add(() => {
      SPRITE.effectContainers.forEach((container, expireMS) => {
        if (WORLD.loop.elapsedMS > expireMS) {
          // 📜 change to destroy with testing
          container.destroy()
          SPRITE.effectContainers.delete(expireMS)
        }
      })
    }, "EFFECTS")
  }
}
export const EFFECTS = new Effects()
