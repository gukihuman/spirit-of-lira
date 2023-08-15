class Scene {
  mdPaths = {}
  mds = {}
  textPosition = {}
  init() {
    _.forEach(this.mdPaths, (value, key) => {
      fetch(value)
        .then((response) => response.text())
        .then((text) => (this.mds[key] = text))
    })
  }
}
export const SCENE = new Scene()
