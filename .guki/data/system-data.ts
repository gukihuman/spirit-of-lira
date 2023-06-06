class SystemData {
  //

  private _refs = LIB.store({
    fullscreen: undefined,
    viewport: undefined,
    input: undefined,
    output: undefined,
  })
  get refs() {
    return this._refs()
  }

  private _states = LIB.store({
    gameWindowScale: 1,
    fullscreen: false,
    loadingScreen: true,
    devMode: false,
    collisionEdit: false,
    collision: true,
    firstMouseMove: false,
    inputFocus: false,

    // UI on / off
    inventory: false,
    input: false,
  })
  get states() {
    return this._states()
  }
}
export const SYSTEM_DATA = new SystemData()
