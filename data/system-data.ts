class systemData {
  //
  refs: any = {
    fullscreen: undefined,
    viewport: undefined,
    input: undefined,
    output: undefined,
  }

  states: any = {
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
  }
  world: any = {
    hero: {},
    heroId: 0,
    lastHero: {}, // previous tick
    hover: {},
    hoverId: 0,
    targetHealth: 0,
  }

  constructor() {
    this.refs = LIB.store(this.refs)
    this.states = LIB.store(this.states)
    this.world = LIB.store(this.world)
  }
}
export const SYSTEM_DATA = new systemData()
