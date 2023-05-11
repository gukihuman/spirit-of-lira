class SystemData {
  //

  private _refs = glib.store({
    background: undefined, // to switch fullscreen
    viewport: undefined, // to init pixi and gic
    input: undefined,
    output: undefined,
  })
  get refs() {
    return this._refs()
  }

  private _states = glib.store({
    gameWindowScale: 1,
    fullscreen: false,
    devMode: false,
    collisionEdit: false,
    autoMouseMove: false,
    loadingScreen: true,
    inventory: false,
    inputFocus: false,
    heroId: undefined,
  })
  get states() {
    return this._states()
  }
}
export const gsd = new SystemData()
