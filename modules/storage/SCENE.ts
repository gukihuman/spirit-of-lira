class Scene {
  mdPaths = {}
  mdPlainTexts = {}
  options = {}
  async init() {
    await this.mdPathsParse()
    WORLD.loop.add(() => {
      if (GLOBAL.context !== "scene") return
      this.scriptParser(SCENE.mdPlainTexts[this.part])
      this.updateData()
    }, "ACTIVE_SCENE")
    this.addEvent
  }
  private async mdPathsParse() {
    const promises = _.map(this.mdPaths, async (value, key) => {
      const response = await fetch(value)
      const text = await response.text()
      this.mdPlainTexts[key] = text
    })
    await Promise.all(promises)
  }
}
export let SCENE = new Scene()
