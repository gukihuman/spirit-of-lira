//
const states = {
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
  targetHealth: 0,

  hero: {},
  heroId: 0,
  lastHero: {}, // previous loop
  hover: {},
  hoverId: 0,
}

export const STATES = LIB.store(states)
