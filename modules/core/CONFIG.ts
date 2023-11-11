class GukiConfig {
  // setup 0 priority for unmentioned values
  init() {
    _.forEach(MODELS.components, (value, name) => {
      if (this.priority.componentInject[name]) return
      this.priority.componentInject[name] = 0
    })
    MODELS.modules.forEach((name) => {
      if (this.priority.modulesInit[name] || name === "CONFIG") return
      this.priority.modulesInit[name] = 0
    })
  }
  // higher values goes first, what is not setted here will be 0
  priority = {
    componentInject: {
      sprite: 2,
      move: 1,
      // <- rest of the logic here
    },
    modulesInit: {
      // CONFIG init is always first, handled separatly in start.ts
      WORLD: 4,
      SAVE: 3, // before ACTIVE_SCENE but after WORLD
      SCENE: 2,
      ACTIVE_SCENE: 1,
      COLLISION: 2,
      ASTAR: 1,
      // <- rest of the logic here
    },
    modulesProcess: {
      STATE: 5,
      SPRITE_UPDATE: 4,
      ACTIVE_SCENE: 3,
      LAST: 2,
      INPUT_UPDATE: 1, // at least SETTINGS depends on it
      // <- rest of the logic here
      ASTAR: -1, // check logic in EVENTS before it is empty4
      EVENTS: -2, // runs all logic for collected events and empty itself
      MOVE: -3,
      CAST: -4,
      TARGET: -5,
      FLIP: -6,
    },
  }
  viewport = {
    width: 1920,
    height: 1080,
  }
  maxFPS = 60
  scene = {
    textBoxWidth: 700,
    textBoxHeight: 220,
    choiceBoxWidth: 550,
    choiceBoxHeight: 80,
    choiceBoxesGap: 15,
    choiceSectionMarginY: 30,
    border: 10,
    unfocusedChoiceBoxOpacity: 0.3,
    focusedChoiceBoxOpacity: 0.65,
    textSpeed: 70,
    transitionSpeed: 700,
    skipDelay: 220,
  }
}
export const CONFIG = new GukiConfig()
