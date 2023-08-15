class Scene {
  mdPaths = {}
  mdPlainTexts = {}
  textboxPosition = {}
  activeImages = ["lira-no-light"]
  init() {
    _.forEach(this.mdPaths, (value, key) => {
      fetch(value)
        .then((response) => response.text())
        .then((text) => (this.mdPlainTexts[key] = text))
    })
  }
}
export let SCENE = new Scene()
