class Settings {
  process() {
    if (this.interface.showKeys) INTERFACE.showKeys = true
    else INTERFACE.showKeys = false
  }
  audio = {
    music: 0.0, // 0.8
    sound: 0.7, // 0.7
  }
  gameplay = {
    // auto attack after kill and also autotarget for mouse like on gamepad
    easyFight: false,
    attackBack: false,
  }
  interface = {
    showKeys: true,
  }
  worldInputEvents = {
    keyboard: {
      decide: "o",
      cast1: "g",
      cast2: "",
      cast3: "",
      autoMouseMove: "e",
      toggleInventory: "i",
      toggleFullscreen: "f",
      lockTarget: "u",
      talk: "t",
    },
    mouse: {
      decide: 0,
      lockTarget: 2,
    },
    gamepad: {
      cast1: "A",
      cast2: "",
      cast3: "",
      toggleFullscreen: "Menu",
      toggleInventory: "Start",
      lockTarget: "RT",
      talk: "Y",
    },
  }
  sceneInputEvents = {
    keyboard: {
      continue: " ", // Space
      previousOption: "ArrowDown",
      nextOption: "ArrowUp",
      toggleFullscreen: "f",
      skipScene: "s",
    },
    mouse: {
      mouseContinue: 0,
    },
    gamepad: {
      continue: "A",
      previousOption: "Down",
      nextOption: "Up",
      toggleFullscreen: "Menu",
      skipScene: "Start",
    },
  }
  interfaceInputEvents = {
    keyboard: {
      toggleInventory: "i",
      toggleFullscreen: "f",
    },
    gamepad: {
      toggleInventory: "Start",
      toggleFullscreen: "Menu",
    },
  }
  inputOther = {
    gamepad: {
      deadZone: 0.15,
    },
  }
  init() {
    WORLD.loop.add(() => {
      this.emitEvents()
    }, "SETTINGS")
    EVENTS.onSingle("previousOption", () => {
      if (!ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].choices) return
      const length = ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].choices.length
      let newIndex = ACTIVE_SCENE.focusedChoiceIndex - 1
      if (newIndex < 0) newIndex = length - 1
      ACTIVE_SCENE.focusedChoiceIndex = newIndex
    })
    EVENTS.onSingle("nextOption", () => {
      if (!ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].choices) return
      const length = ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].choices.length
      let newIndex = ACTIVE_SCENE.focusedChoiceIndex + 1
      if (newIndex > length - 1) newIndex = 0
      ACTIVE_SCENE.focusedChoiceIndex = newIndex
    })
  }
  emitEvents() {
    if (LIBRARY.deadZoneExceed(this.inputOther.gamepad.deadZone, INPUT)) {
      EVENTS.emitSingle("gamepadMove")
    }
    if (INTERFACE.inputFocus) return
    if (GLOBAL.context === "scene" || LAST.context === "scene") {
      _.forEach(this.sceneInputEvents, (settingList, device) => {
        _.forEach(settingList, (button, setting) => {
          if (INPUT[device].justPressed.includes(button)) {
            EVENTS.emitSingle(setting)
          }
        })
      })
      // overwrite default
      if (
        INPUT.keyboard.pressed.includes(
          this.sceneInputEvents.keyboard.continue
        ) ||
        INPUT.gamepad.pressed.includes(this.sceneInputEvents.gamepad.continue)
      ) {
        EVENTS.emitSingle("continue")
      }
    }
    if (GLOBAL.context === "interface" || LAST.context === "interface") {
      _.forEach(this.interfaceInputEvents, (settingList, device) => {
        _.forEach(settingList, (button, setting) => {
          if (INPUT[device].justPressed.includes(button)) {
            EVENTS.emitSingle(setting)
          }
        })
      })
    }
    if (GLOBAL.context === "world" || LAST.context === "world") {
      _.forEach(this.worldInputEvents, (settingList, device) => {
        _.forEach(settingList, (button, setting) => {
          if (INPUT[device].justPressed.includes(button)) {
            EVENTS.emitSingle(setting)
          }
        })
      })
      // overwrite default
      if (
        INPUT.mouse.pressed.includes(this.worldInputEvents.mouse.decide) ||
        INPUT.keyboard.pressed.includes(this.worldInputEvents.keyboard.decide)
      ) {
        if (WORLD.loop.elapsedMS > GLOBAL.sceneContextChangedMS + 500) {
          EVENTS.emitSingle("decide")
          GLOBAL.autoMouseMove = false
        }
      }
      if (
        INPUT.gamepad.pressed.includes(this.worldInputEvents.gamepad.cast1) ||
        INPUT.keyboard.pressed.includes(this.worldInputEvents.keyboard.cast1)
      ) {
        if (WORLD.loop.elapsedMS > GLOBAL.sceneContextChangedMS + 500) {
          EVENTS.emitSingle("cast1")
        }
      }
      if (
        INPUT.gamepad.pressed.includes(this.worldInputEvents.gamepad.cast2) ||
        INPUT.keyboard.pressed.includes(this.worldInputEvents.keyboard.cast2)
      ) {
        EVENTS.emitSingle("cast2")
      }
      if (
        INPUT.gamepad.pressed.includes(this.worldInputEvents.gamepad.cast3) ||
        INPUT.keyboard.pressed.includes(this.worldInputEvents.keyboard.cast3)
      ) {
        EVENTS.emitSingle("cast3")
      }
      if (
        INPUT.gamepad.pressed.includes(this.worldInputEvents.gamepad.cast4) ||
        INPUT.keyboard.pressed.includes(this.worldInputEvents.keyboard.cast4)
      ) {
        EVENTS.emitSingle("cast4")
      }
      if (GLOBAL.lastActiveDevice === "gamepad") GLOBAL.autoMouseMove = false
    }
  }
}
export const SETTINGS = new Settings()
