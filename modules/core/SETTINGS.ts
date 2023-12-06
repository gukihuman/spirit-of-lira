type Focus = {
  columnIndex: 0 | 1
  rowIndex: number
}
interface Echo extends AnyObject {
  focus: Focus
  preventEditHotkeyMode: "cast_only" | "empty_action" | null
}
class Settings {
  lastCheck = ["context_index"] // do some type check with last together
  last: AnyObject = {}
  context_list: ContextSettings[] = ["general", "gamepad", "keyboard", "info"]
  get context_index() {
    return this.context_list.findIndex((context) => {
      return CONTEXT.echo.world?.interface?.settings?.[context]
    })
  }
  get context() {
    return this.context_list[this.context_index]
  }
  echo: Echo = {
    focus: { columnIndex: 0, rowIndex: 0 },
    show_panel: false, // switching delay
    editHotkeyMode: false,
    showButtonIcon: true,
    preventEditHotkeyMode: null,
  }
  general = {
    music: 0.8, // 0.8
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
      editHotkey: "A", // action
    },
  }
  worldInputEvents = {
    keyboard: {
      talk: " ", // action
      reset: " ", // action
      cast1: "e",
      cast2: "",
      cast3: "",
      autoMove: "w",
      toggleFullscreen: "f",
      // toggleInventory: "i",
      toggleSettings: "r",
    },
    mouse: {
      decide: 0,
      lockTarget: 2,
    },
    gamepad: {
      talk: "A", // action
      reset: "A", // action
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
      continue: " ", // action
      skipScene: "q",
      toggleFullscreen: "f",
      previousOption: "ArrowDown",
      nextOption: "ArrowUp",
    },
    mouse: {
      mouseContinue: 0,
    },
    gamepad: {
      continue: "A", // action
      skipScene: "B",
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
  gamepad = {
    leftColumn: {
      Action: ["talk", "reset", "continue", "editHotkey"],
      Close: ["skipScene", "quitInterface"],
      Cast: ["cast1"],
    },
    rightColumn: {
      "Toggle Fullscreen": ["toggleFullscreen"],
      "Toggle Settings": ["toggleSettings"],
    },
  }
  keyboard = {
    leftColumn: {
      Action: ["talk", "reset", "continue"],
      Close: ["skipScene", "quitInterface"],
      Cast: ["cast1"],
    },
    rightColumn: {
      "Toggle Fullscreen": ["toggleFullscreen"],
      "Toggle Settings": ["toggleSettings"],
      "Auto Move": ["autoMove"],
    },
  }
  process() {
    this.switchSettingsTabInputs()
    this.updateShowSettingsPanel()
    this.resetSettingsFocus()
    this.updateSettingsFocus()
    if (this.echo.editHotkeyMode) {
      this.updateHotkey("gamepad")
      this.updateHotkey("keyboard")
    }
  }
  private checkGamepadKeys = (device, setting, pressedKey) => {
    if (device !== "gamepad") return true
    const preventKeys = ["Up", "Down", "Left", "Right", "RB", "LB"]
    // allow only with Cast
    if (!setting.includes("Cast") && preventKeys.includes(pressedKey)) {
      this.echo.preventEditHotkeyMode = "cast_only"
      return false
    }
    return true
  }
  private findPreviousEvents = (pressedKey, places, device) => {
    let previousEvents: string[] = []
    places.forEach((place) => {
      _.entries(place[device]).forEach(([key, value]) => {
        if (value === pressedKey) previousEvents.push(key)
      })
    })
    return previousEvents
  }
  private updateHotkey(device: "keyboard" | "gamepad") {
    if (
      !CONTEXT.echo.world?.interface?.settings?.[device] ||
      INPUT[device].justPressed.length === 0
    ) {
      return
    }
    let events: string[] = []
    const pressedKey = INPUT[device].justPressed[0]
    let newKeySetted = false
    let setting = ""
    if (HOTKEYS[device].includes(pressedKey)) {
      if (this.echo.focus.columnIndex === 0) {
        setting = _.keys(this[device].leftColumn)[this.echo.focus.rowIndex]
        if (this.checkGamepadKeys(device, setting, pressedKey)) {
          events = this[device].leftColumn[setting]
        }
      } else {
        setting = _.keys(this[device].rightColumn)[this.echo.focus.rowIndex]
        if (this.checkGamepadKeys(device, setting, pressedKey)) {
          events = this[device].rightColumn[setting]
        }
      }
    }
    let preventEditHotkey = false
    function cleanPrevious(previousEvents, placeToClean) {
      previousEvents.forEach((event) => {
        if (event === "editHotkey" && setting !== "Action") {
          preventEditHotkey = true
        }
        if (placeToClean[device][event] && !preventEditHotkey) {
          placeToClean[device][event] = ""
        }
      })
    }
    const places = [
      this.interfaceInputEvents,
      this.worldInputEvents,
      this.sceneInputEvents,
    ]
    const foundPlaces: AnyObject[] = []
    events.forEach((event) => {
      places.forEach((place) => {
        if (place[device][event] !== undefined) {
          foundPlaces.push(place)
          newKeySetted = true
        }
      })
    })
    if (newKeySetted) {
      const previousEvents = this.findPreviousEvents(pressedKey, places, device)
      places.forEach((place) => {
        cleanPrevious(previousEvents, place)
      })
      if (preventEditHotkey) {
        this.echo.preventEditHotkeyMode = "empty_action"
        return
      }
      events.forEach((event) => {
        foundPlaces.forEach((place) => {
          place[device][event] = pressedKey
        })
      })
      this.echo.showButtonIcon = false
      // 📜 make literal next frame not just 50ms
      setTimeout(() => {
        this.echo.editHotkeyMode = false
        this.echo.showButtonIcon = true
        this.echo.preventEditHotkeyMode = null
      }, 50)
    }
  }
  updateShowSettingsPanel() {
    if (!CONTEXT.echo.world?.interface?.settings) this.echo.show_panel = false
    if (
      CONTEXT.echo.world?.interface?.settings &&
      !CONTEXT.last.echo?.world?.interface?.settings
    ) {
      this.echo.show_panel = true
    }
    if (this.context_index !== this.last.context_index) {
      this.echo.show_panel = false
      this.debouncedShowAnySettingsPanel()
    }
  }
  debouncedShowAnySettingsPanel = _.debounce(() => {
    this.echo.show_panel = true
  }, 100)
  resetSettingsFocus() {
    if (
      (CONTEXT.echo.world.interface && !CONTEXT.last.echo?.world?.interface) ||
      this.context_index !== this.last.context_index
    ) {
      this.echo.focus.columnIndex = 0
      this.echo.focus.rowIndex = 0
    }
  }
  updateSettingsFocus() {
    if (this.echo.editHotkeyMode) return
    let leftColumnLength = 0
    let rightColumnLength = 0
    if (CONTEXT.echo.world?.interface?.settings?.keyboard) {
      leftColumnLength = _.keys(this.keyboard.leftColumn).length
      rightColumnLength = _.keys(this.keyboard.rightColumn).length
    } else {
      leftColumnLength = _.keys(this.gamepad.leftColumn).length
      rightColumnLength = _.keys(this.gamepad.rightColumn).length
    }
    let maxSettingIndex = 0
    if (this.echo.focus.columnIndex === 0) {
      maxSettingIndex = leftColumnLength - 1
    } else {
      maxSettingIndex = rightColumnLength - 1
    }
    if (INPUT.gamepad.justPressed.includes("Down")) {
      this.echo.focus.rowIndex++
      if (this.echo.focus.rowIndex > maxSettingIndex) {
        this.echo.focus.rowIndex = 0
      }
    }
    if (INPUT.gamepad.justPressed.includes("Up")) {
      this.echo.focus.rowIndex--
      if (this.echo.focus.rowIndex < 0) {
        this.echo.focus.rowIndex = maxSettingIndex
      }
    }
    // left and right are the same while there is only two columns
    if (
      INPUT.gamepad.justPressed.includes("Right") ||
      INPUT.gamepad.justPressed.includes("Left")
    ) {
      if (
        this.echo.focus.columnIndex === 0 &&
        rightColumnLength - 1 >= this.echo.focus.rowIndex
      ) {
        this.echo.focus.columnIndex = 1
      } else if (
        this.echo.focus.columnIndex === 1 &&
        leftColumnLength - 1 >= this.echo.focus.rowIndex
      ) {
        this.echo.focus.columnIndex = 0
      }
    }
  }
  switchSettingsTabInputs() {
    if (!CONTEXT.echo.world?.interface?.settings) return
    if (INPUT.gamepad.justPressed.includes("LB")) {
      EVENTS.emitSingle("switchSettingsTabLeft")
    }
    if (INPUT.gamepad.justPressed.includes("RB")) {
      EVENTS.emitSingle("switchSettingsTabRight")
    }
  }
  init() {
    LOOP.add(() => {
      if (!this.echo.editHotkeyMode) this.emitEvents()
    }, "this")
    EVENTS.onSingle("quitInterface", () => {
      // 📜 make next frame not 20ms
      setTimeout(() => {
        if (this.echo.editHotkeyMode) return
        CONTEXT.set("world")
      }, 20)
    })
    EVENTS.onSingle("previousOption", () => {
      if (SCENE_ACTIVE.focusedChoiceIndex === null) return
      if (!SCENE_ACTIVE[SCENE_ACTIVE.activeLayer].choices) return
      const choices = SCENE_ACTIVE[SCENE_ACTIVE.activeLayer].choices
      let possibleIndex: number | null = null
      // 📜 maybe merge with "continue" in SCENE_ACTIVE
      let startIndex = SCENE_ACTIVE.focusedChoiceIndex - 1
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
      SCENE_ACTIVE.focusedChoiceIndex = possibleIndex
    })
    EVENTS.onSingle("nextOption", () => {
      if (SCENE_ACTIVE.focusedChoiceIndex === null) return
      if (!SCENE_ACTIVE[SCENE_ACTIVE.activeLayer].choices) return
      const choices = SCENE_ACTIVE[SCENE_ACTIVE.activeLayer].choices
      let possibleIndex: number | null = null
      // 📜 maybe merge with "continue" in SCENE_ACTIVE
      let startIndex = SCENE_ACTIVE.focusedChoiceIndex + 1
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
      SCENE_ACTIVE.focusedChoiceIndex = possibleIndex
    })
    EVENTS.onSingle("switchSettingsTabLeft", () => {
      if (SETTINGS.echo.editHotkeyMode) return
      const last = SETTINGS.context_list.length - 1
      SETTINGS.context_index--
      if (SETTINGS.context_index < 0) SETTINGS.context_index = last
      const context = SETTINGS.context_list[SETTINGS.context_index]
      CONTEXT.set("world", "interface", "settings", context)
    })
    EVENTS.onSingle("switchSettingsTabRight", () => {
      if (SETTINGS.echo.editHotkeyMode) return
      const last = SETTINGS.context_list.length - 1
      SETTINGS.context_index++
      if (SETTINGS.context_index > last) SETTINGS.context_index = 0
      const context = SETTINGS.context_list[SETTINGS.context_index]
      CONTEXT.set("world", "interface", "settings", context)
    })
    EVENTS.onSingle("editHotkey", () => {
      if (!CONTEXT.echo.world?.interface?.settings) return
      if (
        CONTEXT.echo.world?.interface?.settings?.keyboard ||
        CONTEXT.echo.world?.interface?.settings?.gamepad
      ) {
        SETTINGS.echo.editHotkeyMode = true
      }
    })
  }
  emitEvents() {
    if (LIBRARY.deadZoneExceed(this.inputOther.gamepad.deadZone, INPUT)) {
      EVENTS.emitSingle("gamepadMove")
    }
    if (INTERFACE.inputFocus) return
    // 📜 why do we need check last here?? some order of events or smth i guess
    if (CONTEXT.echo.scene || CONTEXT.last.echo?.scene) {
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
    if (CONTEXT.echo.world.interface || CONTEXT.last.echo?.world?.interface) {
      _.forEach(this.interfaceInputEvents, (settingList, device) => {
        _.forEach(settingList, (button, setting) => {
          if (INPUT[device].justPressed.includes(button)) {
            EVENTS.emitSingle(setting)
          }
        })
      })
    }
    if (CONTEXT.echo.world || CONTEXT.last.echo?.world) {
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
