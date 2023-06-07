import userConfig from "../../guki.config"

class GukiConfig {
  //
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

  /** setup 0 priority for unmentioned components, it is important because Entity Factory uses the priority object to inject components
   */
  init() {
    STORE.components.forEach((value, name) => {
      if (this.priority.components[name]) return
      this.priority.components[name] = 0
    })
  }

  viewport = {
    width: 1920,
    height: 1080,
  }

  // higher values goes first, what is not setted here will be 0
  priority = {
    //
    // order of injection in entity, nandled by Entity Factory
    components: {
      visual: 2,
      alive: 1,
    },

    // order of execute in ticker, handled by PIXI_GUKI
    toolsAndSystems: {
      render: 4,
      CACHE: 3,
      INPUT: 2, // at least USER_DATA depends on it

      SIGNAL: -1, // runs all logic for collected signals and empty itself
      FLIP: -2,
      attack: -3,
      state: -4,
    },
  }
}

export const CONFIG = new GukiConfig()
