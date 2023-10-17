class Settings {
  audio = {
    // 0.8 kind of default
    music: 0.0,
    sound: 0.8,
  }
  gameplay = {
    // auto attack after kill and also autotarget for mouse like on gamepad
    easyFight: false,
    attackBack: false,
  }
  worldInputEvents = {
    keyboard: {
      moveOrCast1: "o",
      cast1: "g",
      cast2: "",
      cast3: "",
      cast4: "",
      autoMouseMove: "e",
      toggleInventory: "i",
      toggleFullscreen: "f",
      lockTarget: "u",
    },
    mouse: {
      moveOrCast1: 0,
      lockTarget: 2,
    },
    gamepad: {
      cast1: "A",
      cast2: "",
      cast3: "",
      cast4: "",
      toggleFullscreen: "Menu",
      toggleInventory: "Start",
      lockTarget: "RT",
    },
  }
  sceneInputEvents = {
    keyboard: {
      continue: "m",
      previousOption: "ArrowDown",
      nextOption: "ArrowUp",
      toggleFullscreen: "f",
    },
    mouse: {
      mouseContinue: 0,
    },
    gamepad: {
      continue: "A",
      previousOption: "Down",
      nextOption: "Up",
      toggleFullscreen: "Menu",
    },
  }
  interfaceInputEvents = {
    keyboard: {
      toggleInventory: "i",
      toggleFullscreen: "f",
    },
    gamepad: {
      toggleFullscreen: "Menu",
      toggleInventory: "Start",
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
    if (LIB.deadZoneExceed(this.inputOther.gamepad.deadZone, INPUT)) {
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
        INPUT.mouse.pressed.includes(this.worldInputEvents.mouse.moveOrCast1) ||
        INPUT.keyboard.pressed.includes(
          this.worldInputEvents.keyboard.moveOrCast1
        )
      ) {
        if (WORLD.loop.elapsedMS > GLOBAL.sceneContextChangedMS + 500) {
          EVENTS.emitSingle("moveOrCast1")
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
      if (INPUT.lastActiveDevice === "gamepad") GLOBAL.autoMouseMove = false
    }
  }
}
export const SETTINGS = new Settings()
