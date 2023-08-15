class Scene {
  mdPaths = {}
  mdPlainTexts = {}
  textboxPosition = {}
  init() {
    _.forEach(this.mdPaths, (value, key) => {
      fetch(value)
        .then((response) => response.text())
        .then((text) => (this.mdPlainTexts[key] = text))
    })
  }
}
export const SCENE = new Scene()
