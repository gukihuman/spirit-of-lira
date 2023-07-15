import userConfig from "@/guki.config"

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

  /** setup 0 priority for unmentioned values
   */
  init() {
    IMPORTS.components.forEach((value, name) => {
      if (this.priority.componentInject[name]) return
      this.priority.componentInject[name] = 0
    })
    IMPORTS.systems.forEach((value, name) => {
      if (this.priority.systemInit[name]) return
      this.priority.systemInit[name] = 0
    })
  }

  viewport = {
    width: 1920,
    height: 1080,
  }

  fps = 60

  // higher values goes first, what is not setted here will be 0
  priority = {
    //
    componentInject: {
      sprite: 2,
      move: 1,
    },

    systemInit: {},

    systemProcess: {
      //
      // 📜 make some uppercase-tools lowercase-systems, may be all
      state: 4,
      sprite: 3,
      lasttick: 2,
      input: 1, // at least USER_DATA depends on it

      SIGNAL: -1, // runs all logic for collected signals and empty itself
      move: -2,
      attack: -3,
      flip: -4,
    },
  }
}

export const CONFIG = new GukiConfig()
