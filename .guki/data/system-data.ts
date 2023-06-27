class systemData {
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
    autoMouseMove: false,

    // UI on / off
    target: false,
    targetLocked: false,
    inventory: false,
    input: false,
  })
  get states() {
    return this._states()
  }

  private _world = LIB.store({
    hero: {},
    heroId: 0,
    lastHero: {}, // previous tick
    hover: {},
    hoverId: 0,
    targetHealth: 0,
  })
  get world() {
    return this._world()
  }
}
export const SYSTEM_DATA = new systemData()
