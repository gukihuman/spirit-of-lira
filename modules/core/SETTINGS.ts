type Focus = {
  columnIndex: 0 | 1
  settingIndex: number
}
interface Echo extends AnyObject {
  focus: Focus
}
class Settings {
  tabList = ["general", "gamepad", "keyboard", "info"]
  echo: Echo = {
    tabIndex: 0,
    currentTab: "general", // updated automatically
    focus: { columnIndex: 0, settingIndex: 0 },
    showPanel: false, // used to delay when switching
    editHotkeyMode: false,
    showButtonIcon: true,
    preventEditHotkeyMode: false, // for now only when new action on gamepad
    preventEditHotkeyModeCast: false, // Up, Down, Left, Right, RB, LB forcast
  }
  gamepadLeftColumn = {
    Action: ["talk", "reset", "continue", "editHotkey"],
    Close: ["quitScene", "quitInterface"],
    Cast: ["cast1"],
  }
  gamepadRightColumn = {
    "Toggle Fullscreen": ["toggleFullscreen"],
    "Toggle Settings": ["toggleSettings"],
  }
  keyboardLeftColumn = {
    Action: ["talk", "reset", "continue"],
    Close: ["quitScene", "quitInterface"],
    Cast: ["cast1"],
  }
  keyboardRightColumn = {
    "Toggle Fullscreen": ["toggleFullscreen"],
    "Toggle Settings": ["toggleSettings"],
    "Auto Move": ["autoMove"],
  }
  general = {
    music: 0.0, // 0.8
    sound: 0.8, // 0.8
    // auto attack after kill and also autotarget for mouse like on gamepad
    easyFight: false,
    attackBack: false,
    // keepLock is about keeping lock after stop attacking
    // attack target is always locked anyway, coding is hard in that matter
    keepLock: true, // ❗ currently not working properly, like when its off, there is no way to lock target while attacking, ideally make possible to attack target without locking
    showKeys: true,
    floatDamage: true,
  }
  interfaceInputEvents = {
    keyboard: {
      toggleFullscreen: "f",
      // toggleInventory: "i",
      toggleSettings: "r",
      quitInterface: "q",
    },
    gamepad: {
      toggleFullscreen: "Start",
      // toggleInventory: "B",
      toggleSettings: "Menu",
      quitInterface: "B",
      editHotkey: "A",
    },
  }
  worldInputEvents = {
    keyboard: {
      talk: "e", // primeary
      reset: "e", // primary
      cast1: " ",
      cast2: "",
      cast3: "",
      autoMove: "q",
      toggleFullscreen: "f",
      // toggleInventory: "i",
      toggleSettings: "r",
    },
    mouse: {
      decide: 0,
      lockTarget: 2,
    },
    gamepad: {
      talk: "A",
      reset: "A",
      cast1: "X",
      cast2: "",
      cast3: "",
      toggleFullscreen: "Start",
      // toggleInventory: "B",
      toggleSettings: "Menu",
      lockTarget: "LB",
    },
  }
  sceneInputEvents = {
    keyboard: {
      continue: "e", // Space
      quitScene: "q",
      toggleFullscreen: "f",
      previousOption: "ArrowDown",
      nextOption: "ArrowUp",
    },
    mouse: {
      mouseContinue: 0,
      quitScene: 2,
    },
    gamepad: {
      continue: "A",
      quitScene: "B",
      toggleFullscreen: "Start",
      previousOption: "Down",
      nextOption: "Up",
    },
  }
  inputOther = {
    gamepad: {
      deadZone: 0.15,
    },
  }
  init() {
    LOOP.add(() => {
      if (!SETTINGS.echo.editHotkeyMode) this.emitEvents()
    }, "SETTINGS")
    EVENTS.onSingle("quitInterface", () => {
      // 📜 make next frame not 20ms
      setTimeout(() => {
        if (SETTINGS.echo.editHotkeyMode) return
        CONTEXT.set("world")
      }, 20)
    })
    EVENTS.onSingle("previousOption", () => {
      if (ACTIVE_SCENE.focusedChoiceIndex === null) return
      if (!ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].choices) return
      const choices = ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].choices
      let possibleIndex: number | null = null
      // 📜 maybe merge with "continue" in ACTIVE_SCENE
      let startIndex = ACTIVE_SCENE.focusedChoiceIndex - 1
      if (startIndex < 0) startIndex += choices.length
      for (let i = startIndex; i < choices.length; i--) {
        if (i < 0) i += choices.length
        let choice = choices[i]
        if (!choice.bulb) {
          possibleIndex = i
          break
        }
        const condition: Condition | undefined =
          SCENE.sceneConditions[choice.bulbScene]
        if (!condition) {
          possibleIndex = i
          break
        }
        if (condition.getCondition()) {
          possibleIndex = i
          break
        }
      }
      ACTIVE_SCENE.focusedChoiceIndex = possibleIndex
    })
    EVENTS.onSingle("nextOption", () => {
      if (ACTIVE_SCENE.focusedChoiceIndex === null) return
      if (!ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].choices) return
      const choices = ACTIVE_SCENE[ACTIVE_SCENE.activeLayer].choices
      let possibleIndex: number | null = null
      // 📜 maybe merge with "continue" in ACTIVE_SCENE
      let startIndex = ACTIVE_SCENE.focusedChoiceIndex + 1
      if (startIndex >= choices.length) startIndex -= choices.length
      for (let i = startIndex; i < choices.length; i++) {
        if (i >= choices.length) i -= choices.length
        let choice = choices[i]
        if (!choice.bulb) {
          possibleIndex = i
          break
        }
        const condition: Condition | undefined =
          SCENE.sceneConditions[choice.bulbScene]
        if (!condition) {
          possibleIndex = i
          break
        }
        if (condition.getCondition()) {
          possibleIndex = i
          break
        }
      }
      ACTIVE_SCENE.focusedChoiceIndex = possibleIndex
    })
  }
  emitEvents() {
    if (LIBRARY.deadZoneExceed(this.inputOther.gamepad.deadZone, INPUT)) {
      EVENTS.emitSingle("gamepadMove")
    }
    if (INTERFACE.inputFocus) return
    // 📜 why do we need check last here?? some order of events or smth i guess
    if (CONTEXT.echo.scene || CONTEXT.last.echo.scene) {
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
    if (CONTEXT.echo.world.interface || CONTEXT.last.echo.world.interface) {
      _.forEach(this.interfaceInputEvents, (settingList, device) => {
        _.forEach(settingList, (button, setting) => {
          if (INPUT[device].justPressed.includes(button)) {
            EVENTS.emitSingle(setting)
          }
        })
      })
    }
    if (CONTEXT.echo.world || CONTEXT.last.echo.world) {
      _.forEach(this.worldInputEvents, (settingList, device) => {
        _.forEach(settingList, (button, setting) => {
          if (INPUT[device].justPressed.includes(button)) {
            EVENTS.emitSingle(setting)
          }
        })
      })
      // overwrite default
      if (
        INPUT.mouse.pressed.includes(this.worldInputEvents.mouse.decide)
        // INPUT.keyboard.pressed.includes(this.worldInputEvents.keyboard.decide)
      ) {
        if (!GLOBAL.firstUserGesture) return
        if (LOOP.elapsedMS > GLOBAL.sceneContextChangedMS + 500) {
          EVENTS.emitSingle("decide")
          GLOBAL.autoMove = false
        }
      }
      if (
        INPUT.gamepad.pressed.includes(this.worldInputEvents.gamepad.cast1) ||
        INPUT.keyboard.pressed.includes(this.worldInputEvents.keyboard.cast1)
      ) {
        if (LOOP.elapsedMS > GLOBAL.sceneContextChangedMS + 500) {
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
      if (GLOBAL.lastActiveDevice === "gamepad") GLOBAL.autoMove = false
    }
  }
}
export const SETTINGS = LIBRARY.resonate(new Settings())
