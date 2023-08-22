import userConfig from "@/guki.config"
class GukiConfig {
  /** merge user config with default config */
  constructor() {
    if (!userConfig) return
    _.forEach(userConfig, (value, key) => {
      if (this[key] && typeof this[key] === "object") {
        this[key] = _.merge(this[key], value)
      } else {
        this[key] = value
      }
    })
  }
  /** setup 0 priority for unmentioned values
   */
  init() {
    _.forEach(MODELS.components, (value, name) => {
      if (this.priority.componentInject[name]) return
      this.priority.componentInject[name] = 0
    })
    _.forEach(MODELS.systems, (value, name) => {
      if (this.priority.systemInit[name]) return
      this.priority.systemInit[name] = 0
    })
  }
  viewport = {
    width: 1920,
    height: 1080,
  }
  maxFPS = 60
  // higher values goes first, what is not setted here will be 0
  priority = {
    componentInject: {
      sprite: 2,
      move: 1,
    },
    systemInit: {
      collision: 2,
      astar: 1,
    },
    process: {
      state: 5,
      sprite: 4,
      ACTIVE_SCENE: 3,
      LAST: 2,
      input: 1, // at least SETTINGS depends on it
      // <- rest of the logic here
      astar: -1, // check logic in EVENTS before it is empty
      EVENTS: -2, // runs all logic for collected events and empty itself
      move: -3,
      cast: -4,
      target: -5,
      flip: -6,
    },
  }
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
    skipDelay: 250,
  }
}
export const CONFIG = new GukiConfig()
