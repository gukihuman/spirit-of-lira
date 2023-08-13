const scene: AnyObject = {
  active: undefined,
  // 📜 maybe handle this from other place, maybe from here but trough process
  init() {
    this.active = ASSETS.webps["e1s1-arms-down"]
  },
}
export const SCENE = LIB.store(scene)
