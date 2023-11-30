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
  process() {
    this.switchSettingsTab()
    this.updateCurrentSettingsTab()
    this.updateShowAnySettingsPanel()
    this.resetSettingsFocus()
    this.updateSettingsFocus()
    if (this.echo.editHotkeyMode) this.updateInEditHotkeyMode()
  }
  updateInEditHotkeyMode() {
    if (
      this.echo.currentTab === "gamepad" &&
      INPUT.gamepad.justPressed.length > 0
    ) {
      // make function that gonna work for both the keyboard and gamepad
      let events: string[] = []
      const pressedKey = INPUT.gamepad.justPressed[0]
      let newKeySetted = false
      const checkPressedKeyAction = (setting: string) => {
        const preventActionKeys = ["Up", "Down", "Left", "Right", "RB", "LB"]
        if (
          !setting.includes("Cast") &&
          preventActionKeys.includes(pressedKey)
        ) {
          this.echo.preventEditHotkeyModeCast = true
          return false
        }
        return true
      }
      let setting = ""
      if (HOTKEYS.gamepad.includes(pressedKey)) {
        if (this.echo.focus.columnIndex === 0) {
          setting = _.keys(this.gamepadLeftColumn)[this.echo.focus.settingIndex]
          if (checkPressedKeyAction(setting)) {
            events = this.gamepadLeftColumn[setting]
          }
        } else {
          setting = _.keys(this.gamepadRightColumn)[
            this.echo.focus.settingIndex
          ]
          if (checkPressedKeyAction(setting)) {
            events = this.gamepadRightColumn[setting]
          }
        }
      }
      const findPreviousEvents = (pressedKey) => {
        let previousEvents: string[] = []
        _.entries(this.interfaceInputEvents.gamepad).forEach(([key, value]) => {
          if (value === pressedKey) previousEvents.push(key)
        })
        _.entries(this.worldInputEvents.gamepad).forEach(([key, value]) => {
          if (value === pressedKey) previousEvents.push(key)
        })
        _.entries(this.sceneInputEvents.gamepad).forEach(([key, value]) => {
          if (value === pressedKey) previousEvents.push(key)
        })
        return previousEvents
      }
      let preventEditHotkey = false
      function cleanPrevious(previousEvents, placeToClean) {
        previousEvents.forEach((event) => {
          if (event === "editHotkey" && setting !== "Action") {
            preventEditHotkey = true
          }
          if (placeToClean.gamepad[event] && !preventEditHotkey) {
            placeToClean.gamepad[event] = ""
          }
        })
      }
      let foundPlace: AnyObject[] = []
      events.forEach((event) => {
        if (this.interfaceInputEvents.gamepad[event] !== undefined) {
          foundPlace.push(this.interfaceInputEvents)
          newKeySetted = true
        }
        if (this.worldInputEvents.gamepad[event] !== undefined) {
          foundPlace.push(this.worldInputEvents)
          newKeySetted = true
        }
        if (this.sceneInputEvents.gamepad[event] !== undefined) {
          foundPlace.push(this.sceneInputEvents)
          newKeySetted = true
        }
      })
      if (newKeySetted) {
        const previousEvents = findPreviousEvents(pressedKey)
        cleanPrevious(previousEvents, this.interfaceInputEvents)
        cleanPrevious(previousEvents, this.worldInputEvents)
        cleanPrevious(previousEvents, this.sceneInputEvents)
        if (preventEditHotkey) {
          this.echo.preventEditHotkeyMode = true
          return
        }
        events.forEach((event) => {
          foundPlace.forEach((place) => {
            place.gamepad[event] = pressedKey
          })
        })
        this.echo.showButtonIcon = false
        // 📜 make literal next frame not just 50ms
        setTimeout(() => {
          this.echo.editHotkeyMode = false
          this.echo.showButtonIcon = true
          this.echo.preventEditHotkeyMode = false
          this.echo.preventEditHotkeyModeCast = false
        }, 50)
      }
    } else if (
      this.echo.currentTab === "keyboard" &&
      INPUT.keyboard.justPressed.length > 0
    ) {
      let events: string[] = []
      const pressedKey = INPUT.keyboard.justPressed[0]
      let newKeySetted = false
      if (HOTKEYS.keyboard.includes(INPUT.keyboard.justPressed[0])) {
        if (this.echo.focus.columnIndex === 0) {
          const setting = _.keys(this.keyboardLeftColumn)[
            this.echo.focus.settingIndex
          ]
          events = this.keyboardLeftColumn[setting]
        } else {
          const setting = _.keys(this.keyboardRightColumn)[
            this.echo.focus.settingIndex
          ]
          events = this.keyboardRightColumn[setting]
        }
      }
      const findPreviousEvents = (pressedKey) => {
        let previousEvents: string[] = []
        _.entries(this.interfaceInputEvents.keyboard).forEach(
          ([key, value]) => {
            if (value === pressedKey) previousEvents.push(key)
          }
        )
        _.entries(this.worldInputEvents.keyboard).forEach(([key, value]) => {
          if (value === pressedKey) previousEvents.push(key)
        })
        _.entries(this.sceneInputEvents.keyboard).forEach(([key, value]) => {
          if (value === pressedKey) previousEvents.push(key)
        })
        return previousEvents
      }
      function cleanPrevious(previousEvents, placeToClean) {
        previousEvents.forEach((event) => {
          if (placeToClean.keyboard[event]) placeToClean.keyboard[event] = ""
        })
      }
      let foundPlace: AnyObject[] = []
      events.forEach((event) => {
        if (this.interfaceInputEvents.keyboard[event] !== undefined) {
          foundPlace.push(this.interfaceInputEvents)
          newKeySetted = true
        }
        if (this.worldInputEvents.keyboard[event] !== undefined) {
          foundPlace.push(this.worldInputEvents)
          newKeySetted = true
        }
        if (this.sceneInputEvents.keyboard[event] !== undefined) {
          foundPlace.push(this.sceneInputEvents)
          newKeySetted = true
        }
      })
      if (newKeySetted) {
        const previousEvents = findPreviousEvents(pressedKey)
        cleanPrevious(previousEvents, this.interfaceInputEvents)
        cleanPrevious(previousEvents, this.worldInputEvents)
        cleanPrevious(previousEvents, this.sceneInputEvents)
        events.forEach((event) => {
          foundPlace.forEach((place) => {
            place.keyboard[event] = pressedKey
          })
        })
        // 📜 make literal next frame not just 50ms
        this.echo.showButtonIcon = false
        setTimeout(() => {
          this.echo.editHotkeyMode = false
          this.echo.showButtonIcon = true
          this.echo.preventEditHotkeyMode = false
        }, 50)
      }
    }
  }
  updateCurrentSettingsTab() {
    this.echo.currentTab = this.tabList[this.echo.tabIndex]
  }
  updateShowAnySettingsPanel() {
    if (!CONTEXT.echo.world?.interface?.settings) this.echo.showPanel = false
    if (
      CONTEXT.echo.world?.interface?.settings &&
      !CONTEXT.last.echo.world?.interface?.settings
    ) {
      this.echo.showPanel = true
    }
    if (this.echo.tabIndex !== LAST.settingsTabIndex) {
      this.echo.showPanel = false
      this.debouncedShowAnySettingsPanel()
    }
  }
  debouncedShowAnySettingsPanel = _.debounce(() => {
    this.echo.showPanel = true
  }, 100)
  resetSettingsFocus() {
    if (
      (CONTEXT.echo.world.interface && !CONTEXT.last.echo.world.interface) ||
      this.echo.tabIndex !== LAST.settingsTabIndex
    ) {
      this.echo.focus.columnIndex = 0
      this.echo.focus.settingIndex = 0
    }
  }
  updateSettingsFocus() {
    if (this.echo.editHotkeyMode) return
    let leftColumnLength = 0
    let rightColumnLength = 0
    if (this.echo.currentTab === "keyboard") {
      leftColumnLength = _.keys(this.keyboardLeftColumn).length
      rightColumnLength = _.keys(this.keyboardRightColumn).length
    } else if (this.echo.currentTab === "gamepad") {
      leftColumnLength = _.keys(this.gamepadLeftColumn).length
      rightColumnLength = _.keys(this.gamepadRightColumn).length
    }
    let maxSettingIndex = 0
    if (this.echo.focus.columnIndex === 0) {
      maxSettingIndex = leftColumnLength - 1
    } else {
      maxSettingIndex = rightColumnLength - 1
    }
    if (INPUT.gamepad.justPressed.includes("Down")) {
      this.echo.focus.settingIndex++
      if (this.echo.focus.settingIndex > maxSettingIndex) {
        this.echo.focus.settingIndex = 0
      }
    }
    if (INPUT.gamepad.justPressed.includes("Up")) {
      this.echo.focus.settingIndex--
      if (this.echo.focus.settingIndex < 0) {
        this.echo.focus.settingIndex = maxSettingIndex
      }
    }
    // left and right are the same while there is only two columns
    if (
      INPUT.gamepad.justPressed.includes("Right") ||
      INPUT.gamepad.justPressed.includes("Left")
    ) {
      if (
        this.echo.focus.columnIndex === 0 &&
        rightColumnLength - 1 >= this.echo.focus.settingIndex
      ) {
        this.echo.focus.columnIndex = 1
      } else if (
        this.echo.focus.columnIndex === 1 &&
        leftColumnLength - 1 >= this.echo.focus.settingIndex
      ) {
        this.echo.focus.columnIndex = 0
      }
    }
  }
  switchSettingsTab() {
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
