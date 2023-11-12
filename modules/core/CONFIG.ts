class GukiConfig {
  // automatically loaded from modules folder by load.ts
  modules: string[] = [] // ["WORLD", "GLOBAL", ...]
  components: string[] = [] // ["ATTTRIBUTES", "MOVE", ...]
  // setup 0 priority for unmentioned values
  init() {
    this.components.forEach((name) => {
      if (this.priority.componentInject[name]) return
      this.priority.componentInject[name] = 0
    })
    this.modules.forEach((name) => {
      if (this.priority.modulesInit[name] || name === "CONFIG") return
      this.priority.modulesInit[name] = 0
    })
  }
  // higher values goes first, what is not setted here will be 0
  priority = {
    componentInject: {
      SPRITE: 2,
      MOVE: 1,
      // <- rest of the logic
    },
    modulesInit: {
      // CONFIG init is always first, handled separatly in start.ts
      ENTITIES_STATIC: 6,
      ENTITIES: 5,
      WORLD: 4,
      SAVE: 3, // before ACTIVE_SCENE but after WORLD
      SCENE: 2,
      ACTIVE_SCENE: 1,
      COLLISION: 2,
      ASTAR: 1,
      // <- rest of the logic
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
