declare global {
  type DamageOverlay = {
    hero: boolean
    damage: number
    x: number
    y: number
    entityHeight: number
    screen: {
      x: number
      y: number
      randomX: number
      randomY: number
      offsetX: number
      offsetY: number
      opacity: number
      scale: number
    }
    startMS: number
  }
  type SettingsFocus = {
    columnIndex: 0 | 1
    settingIndex: number
  }
}
interface Inter extends AnyObject {
  damageOverlays: DamageOverlay[]
  settingsFocus: SettingsFocus
}
const inter: Inter = {
  overlay: true,
  damageOverlays: [],
  floatDamage: true,
  damageLifetimeMS: 1200,
  inventory: false,

  settings: false,
  settingsTabList: ["general", "gamepad", "keyboard", "info"],
  settingsTabIndex: 0,
  currentSettingsTab: "general", // updated automatically
  settingsFocus: { columnIndex: 0, settingIndex: 0 },
  showAnySettingsPanel: false, // used to delay when switching
  editHotkeyMode: false,
  showButtonIcon: true,
  preventEditHotkeyMode: false, // for now only when new action on gamepad
  preventEditHotkeyModeCast: false, // Up, Down, Left, Right, RB, LB with Cast

  target: false,
  targetLocked: false,
  targetHealth: 0,
  targetMaxHealth: 0,
  talk: false,
  talkPosition: { x: 0, y: 0 },
  talkEntity: "",
  buttonHover: false,
  skipHover: false,
  showKeys: true,
  heroHealth: 0,
  heroMaxHealth: 0,
  heroEnergy: 0,
  heroMaxEnergy: 0,
  reset: false,
  process() {
    if (GLOBAL.context === "scene") this.overlay = false
    else this.overlay = true
    this.floatDamage = SETTINGS.general.floatDamage
    this.showKeys = SETTINGS.general.showKeys
    if (GLOBAL.context !== "scene") {
      if (SH.hero.TARGET.id && SH.hero.TARGET.entity) {
        INTERFACE.target = true
        INTERFACE.targetHealth = SH.hero.TARGET.entity.ATTRIBUTES.health
        INTERFACE.targetMaxHealth =
          ENTITIES.collection[SH.hero.TARGET.entity.name].ATTRIBUTES.health
      } else {
        INTERFACE.target = false
      }
      INTERFACE.heroHealth = SH.hero.ATTRIBUTES.health
      INTERFACE.heroMaxHealth = SH.hero.ATTRIBUTES.healthMax
      INTERFACE.heroEnergy = SH.hero.ATTRIBUTES.energy
      INTERFACE.heroMaxEnergy = SH.hero.ATTRIBUTES.energyMax
      if (SH.hero.TARGET.locked) INTERFACE.targetLocked = true
      else INTERFACE.targetLocked = false
    }
    this.switchSettingsTab()
    this.processFloatDamage()
    this.updateCurrentSettingsTab()
    this.updateShowAnySettingsPanel()
    this.resetSettingsFocus()
    this.updateSettingsFocus()
    if (this.editHotkeyMode) this.updateInEditHotkeyMode()
  },
  init() {
    EVENTS.onSingle("switchSettingsTabLeft", () => {
      if (INTERFACE.editHotkeyMode) return
      const last = this.settingsTabList.length - 1
      this.settingsTabIndex--
      if (this.settingsTabIndex < 0) this.settingsTabIndex = last
    })
    EVENTS.onSingle("switchSettingsTabRight", () => {
      if (INTERFACE.editHotkeyMode) return
      const last = this.settingsTabList.length - 1
      this.settingsTabIndex++
      if (this.settingsTabIndex > last) this.settingsTabIndex = 0
    })
    EVENTS.onSingle("editHotkey", () => {
      if (
        INTERFACE.settings &&
        (this.currentSettingsTab === "gamepad" ||
          this.currentSettingsTab === "keyboard")
      ) {
        this.editHotkeyMode = true
      }
    })
  },
  updateInEditHotkeyMode() {
    if (
      this.currentSettingsTab === "gamepad" &&
      INPUT.gamepad.justPressed.length > 0
    ) {
      // make function that gonna work for both the keyboard and gamepad
      let events: string[] = []
      const pressedKey = INPUT.gamepad.justPressed[0]
      let newKeySetted = false
      function checkPressedKeyAction(setting: string) {
        const preventActionKeys = ["Up", "Down", "Left", "Right", "RB", "LB"]
        if (
          !setting.includes("Cast") &&
          preventActionKeys.includes(pressedKey)
        ) {
          INTERFACE.preventEditHotkeyModeCast = true
          return false
        }
        return true
      }
      let setting = ""
      if (HOTKEYS.gamepad.includes(pressedKey)) {
        if (this.settingsFocus.columnIndex === 0) {
          setting = _.keys(SETTINGS.gamepadLeftColumn)[
            this.settingsFocus.settingIndex
          ]
          if (checkPressedKeyAction(setting)) {
            events = SETTINGS.gamepadLeftColumn[setting]
          }
        } else {
          setting = _.keys(SETTINGS.gamepadRightColumn)[
            this.settingsFocus.settingIndex
          ]
          if (checkPressedKeyAction(setting)) {
            events = SETTINGS.gamepadRightColumn[setting]
          }
        }
      }
      function findPreviousEvents(pressedKey) {
        let previousEvents: string[] = []
        _.entries(SETTINGS.interfaceInputEvents.gamepad).forEach(
          ([key, value]) => {
            if (value === pressedKey) previousEvents.push(key)
          }
        )
        _.entries(SETTINGS.worldInputEvents.gamepad).forEach(([key, value]) => {
          if (value === pressedKey) previousEvents.push(key)
        })
        _.entries(SETTINGS.sceneInputEvents.gamepad).forEach(([key, value]) => {
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
        if (SETTINGS.interfaceInputEvents.gamepad[event] !== undefined) {
          foundPlace.push(SETTINGS.interfaceInputEvents)
          newKeySetted = true
        }
        if (SETTINGS.worldInputEvents.gamepad[event] !== undefined) {
          foundPlace.push(SETTINGS.worldInputEvents)
          newKeySetted = true
        }
        if (SETTINGS.sceneInputEvents.gamepad[event] !== undefined) {
          foundPlace.push(SETTINGS.sceneInputEvents)
          newKeySetted = true
        }
      })
      if (newKeySetted) {
        const previousEvents = findPreviousEvents(pressedKey)
        cleanPrevious(previousEvents, SETTINGS.interfaceInputEvents)
        cleanPrevious(previousEvents, SETTINGS.worldInputEvents)
        cleanPrevious(previousEvents, SETTINGS.sceneInputEvents)
        if (preventEditHotkey) {
          this.preventEditHotkeyMode = true
          return
        }
        events.forEach((event) => {
          foundPlace.forEach((place) => {
            place.gamepad[event] = pressedKey
          })
        })
        this.showButtonIcon = false
        // 📜 make literal next frame not just 50ms
        setTimeout(() => {
          this.editHotkeyMode = false
          this.showButtonIcon = true
          this.preventEditHotkeyMode = false
          this.preventEditHotkeyModeCast = false
        }, 50)
      }
    } else if (
      this.currentSettingsTab === "keyboard" &&
      INPUT.keyboard.justPressed.length > 0
    ) {
      let events: string[] = []
      const pressedKey = INPUT.keyboard.justPressed[0]
      let newKeySetted = false
      if (HOTKEYS.keyboard.includes(INPUT.keyboard.justPressed[0])) {
        if (this.settingsFocus.columnIndex === 0) {
          const setting = _.keys(SETTINGS.keyboardLeftColumn)[
            this.settingsFocus.settingIndex
          ]
          events = SETTINGS.keyboardLeftColumn[setting]
        } else {
          const setting = _.keys(SETTINGS.keyboardRightColumn)[
            this.settingsFocus.settingIndex
          ]
          events = SETTINGS.keyboardRightColumn[setting]
        }
      }
      function findPreviousEvents(pressedKey) {
        let previousEvents: string[] = []
        _.entries(SETTINGS.interfaceInputEvents.keyboard).forEach(
          ([key, value]) => {
            if (value === pressedKey) previousEvents.push(key)
          }
        )
        _.entries(SETTINGS.worldInputEvents.keyboard).forEach(
          ([key, value]) => {
            if (value === pressedKey) previousEvents.push(key)
          }
        )
        _.entries(SETTINGS.sceneInputEvents.keyboard).forEach(
          ([key, value]) => {
            if (value === pressedKey) previousEvents.push(key)
          }
        )
        return previousEvents
      }
      function cleanPrevious(previousEvents, placeToClean) {
        previousEvents.forEach((event) => {
          if (placeToClean.keyboard[event]) placeToClean.keyboard[event] = ""
        })
      }
      let foundPlace: AnyObject[] = []
      events.forEach((event) => {
        if (SETTINGS.interfaceInputEvents.keyboard[event] !== undefined) {
          foundPlace.push(SETTINGS.interfaceInputEvents)
          newKeySetted = true
        }
        if (SETTINGS.worldInputEvents.keyboard[event] !== undefined) {
          foundPlace.push(SETTINGS.worldInputEvents)
          newKeySetted = true
        }
        if (SETTINGS.sceneInputEvents.keyboard[event] !== undefined) {
          foundPlace.push(SETTINGS.sceneInputEvents)
          newKeySetted = true
        }
      })
      if (newKeySetted) {
        const previousEvents = findPreviousEvents(pressedKey)
        cleanPrevious(previousEvents, SETTINGS.interfaceInputEvents)
        cleanPrevious(previousEvents, SETTINGS.worldInputEvents)
        cleanPrevious(previousEvents, SETTINGS.sceneInputEvents)
        events.forEach((event) => {
          foundPlace.forEach((place) => {
            place.keyboard[event] = pressedKey
          })
        })
        // 📜 make literal next frame not just 50ms
        this.showButtonIcon = false
        setTimeout(() => {
          this.editHotkeyMode = false
          this.showButtonIcon = true
          this.preventEditHotkeyMode = false
        }, 50)
      }
    }
  },
  updateCurrentSettingsTab() {
    this.currentSettingsTab = this.settingsTabList[this.settingsTabIndex]
  },
  updateShowAnySettingsPanel() {
    if (GLOBAL.context !== "interface") this.showAnySettingsPanel = false
    if (GLOBAL.context === "interface" && LAST.context !== "interface") {
      this.showAnySettingsPanel = true
    }
    if (this.settingsTabIndex !== LAST.settingsTabIndex) {
      this.showAnySettingsPanel = false
      this.debouncedShowAnySettingsPanel()
    }
  },
  resetSettingsFocus() {
    if (
      (GLOBAL.context === "interface" && LAST.context !== "interface") ||
      this.settingsTabIndex !== LAST.settingsTabIndex
    ) {
      this.settingsFocus.columnIndex = 0
      this.settingsFocus.settingIndex = 0
    }
  },
  updateSettingsFocus() {
    if (INTERFACE.editHotkeyMode) return
    let leftColumnLength = 0
    let rightColumnLength = 0
    if (this.currentSettingsTab === "keyboard") {
      leftColumnLength = _.keys(SETTINGS.keyboardLeftColumn).length
      rightColumnLength = _.keys(SETTINGS.keyboardRightColumn).length
    } else if (this.currentSettingsTab === "gamepad") {
      leftColumnLength = _.keys(SETTINGS.gamepadLeftColumn).length
      rightColumnLength = _.keys(SETTINGS.gamepadRightColumn).length
    }
    let maxSettingIndex = 0
    if (this.settingsFocus.columnIndex === 0) {
      maxSettingIndex = leftColumnLength - 1
    } else {
      maxSettingIndex = rightColumnLength - 1
    }
    if (INPUT.gamepad.justPressed.includes("Down")) {
      this.settingsFocus.settingIndex++
      if (this.settingsFocus.settingIndex > maxSettingIndex) {
        this.settingsFocus.settingIndex = 0
      }
    }
    if (INPUT.gamepad.justPressed.includes("Up")) {
      this.settingsFocus.settingIndex--
      if (this.settingsFocus.settingIndex < 0) {
        this.settingsFocus.settingIndex = maxSettingIndex
      }
    }
    // left and right are the same while there is only two columns
    if (
      INPUT.gamepad.justPressed.includes("Right") ||
      INPUT.gamepad.justPressed.includes("Left")
    ) {
      if (
        this.settingsFocus.columnIndex === 0 &&
        rightColumnLength - 1 >= this.settingsFocus.settingIndex
      ) {
        this.settingsFocus.columnIndex = 1
      } else if (
        this.settingsFocus.columnIndex === 1 &&
        leftColumnLength - 1 >= this.settingsFocus.settingIndex
      ) {
        this.settingsFocus.columnIndex = 0
      }
    }
  },
  debouncedShowAnySettingsPanel: _.debounce(() => {
    INTERFACE.showAnySettingsPanel = true
  }, 100),
  switchSettingsTab() {
    if (!this.settings) return
    if (INPUT.gamepad.justPressed.includes("LB")) {
      EVENTS.emitSingle("switchSettingsTabLeft")
    }
    if (INPUT.gamepad.justPressed.includes("RB")) {
      EVENTS.emitSingle("switchSettingsTabRight")
    }
  },
  processFloatDamage() {
    this.damageOverlays.forEach((overlay, index) => {
      if (LOOP.elapsedMS > overlay.startMS + this.damageLifetimeMS) {
        this.damageOverlays.splice(index, 1)
      }
      const { x, y } = COORD.coordinateToScreen(overlay.x, overlay.y)
      overlay.screen.offsetX += overlay.screen.randomX * LOOP.deltaSec
      overlay.screen.offsetY += overlay.screen.randomY * LOOP.deltaSec
      overlay.screen.x = x + overlay.screen.offsetX
      overlay.screen.y = y + overlay.screen.offsetY
      const elapsed = LOOP.elapsedMS - overlay.startMS
      const timeToScale = this.damageLifetimeMS * 0.3
      const timeToAppear = this.damageLifetimeMS * 0.15
      const timeToStartDissapear = this.damageLifetimeMS * 0.8
      const timeToDissapear = this.damageLifetimeMS * 0.2 // based on 0.8
      if (elapsed < timeToAppear) {
        overlay.screen.opacity = elapsed / timeToAppear
      }
      if (elapsed > timeToStartDissapear) {
        overlay.screen.opacity =
          1 - (elapsed - timeToStartDissapear) / timeToDissapear
      }
      if (elapsed < timeToScale) {
        const scaleDiff = overlay.screen.scale - 1 // to achieve 1 and not 0
        overlay.screen.scale = 1 + scaleDiff * (1 - elapsed / timeToScale)
      }
    })
  },
}
export const INTERFACE = LIBRARY.store(inter)
