class Effects {
  front = {
    "sword-hit": 500,
    "bunbo-bite": 500,
  }
  back = {}
  init() {
    LOOP.add(() => {
      SPRITE.effectContainers.forEach((container, expireMS) => {
        if (LOOP.elapsedMS > expireMS) {
          container.destroy()
          // 📜 check if destroy is successful, sometimes effects hanging
          // mb its only hmr though
          SPRITE.effectContainers.delete(expireMS)
        }
      })
    }, "EFFECTS")
  }
}
export const EFFECTS = new Effects()
