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
}
interface Inter extends AnyObject {
  damageOverlays: DamageOverlay[]
}
const inter: Inter = {
  overlay: true,
  damageOverlays: [],
  floatDamage: true,
  damageLifetimeMS: 1200,
  inventory: false,
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
    if (SETTINGS.echo.editHotkeyMode) this.updateInEditHotkeyMode()
  },
  init() {
    EVENTS.onSingle("switchSettingsTabLeft", () => {
      if (SETTINGS.echo.editHotkeyMode) return
      const last = SETTINGS.tabList.length - 1
      SETTINGS.echo.tabIndex--
      if (SETTINGS.echo.tabIndex < 0) SETTINGS.echo.tabIndex = last
    })
    EVENTS.onSingle("switchSettingsTabRight", () => {
      if (SETTINGS.echo.editHotkeyMode) return
      const last = SETTINGS.tabList.length - 1
      SETTINGS.echo.tabIndex++
      if (SETTINGS.echo.tabIndex > last) SETTINGS.echo.tabIndex = 0
    })
    EVENTS.onSingle("editHotkey", () => {
      if (
        SETTINGS.echo.show &&
        (SETTINGS.echo.currentTab === "gamepad" ||
          SETTINGS.echo.currentTab === "keyboard")
      ) {
        SETTINGS.echo.editHotkeyMode = true
      }
    })
  },
  updateInEditHotkeyMode() {
    if (
      SETTINGS.echo.currentTab === "gamepad" &&
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
          SETTINGS.echo.preventEditHotkeyModeCast = true
          return false
        }
        return true
      }
      let setting = ""
      if (HOTKEYS.gamepad.includes(pressedKey)) {
        if (SETTINGS.echo.focus.columnIndex === 0) {
          setting = _.keys(SETTINGS.gamepadLeftColumn)[
            SETTINGS.echo.focus.settingIndex
          ]
          if (checkPressedKeyAction(setting)) {
            events = SETTINGS.gamepadLeftColumn[setting]
          }
        } else {
          setting = _.keys(SETTINGS.gamepadRightColumn)[
            SETTINGS.echo.focus.settingIndex
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
          SETTINGS.echo.preventEditHotkeyMode = true
          return
        }
        events.forEach((event) => {
          foundPlace.forEach((place) => {
            place.gamepad[event] = pressedKey
          })
        })
        SETTINGS.echo.showButtonIcon = false
        // 📜 make literal next frame not just 50ms
        setTimeout(() => {
          SETTINGS.echo.editHotkeyMode = false
          SETTINGS.echo.showButtonIcon = true
          SETTINGS.echo.preventEditHotkeyMode = false
          SETTINGS.echo.preventEditHotkeyModeCast = false
        }, 50)
      }
    } else if (
      SETTINGS.echo.currentTab === "keyboard" &&
      INPUT.keyboard.justPressed.length > 0
    ) {
      let events: string[] = []
      const pressedKey = INPUT.keyboard.justPressed[0]
      let newKeySetted = false
      if (HOTKEYS.keyboard.includes(INPUT.keyboard.justPressed[0])) {
        if (SETTINGS.echo.focus.columnIndex === 0) {
          const setting = _.keys(SETTINGS.keyboardLeftColumn)[
            SETTINGS.echo.focus.settingIndex
          ]
          events = SETTINGS.keyboardLeftColumn[setting]
        } else {
          const setting = _.keys(SETTINGS.keyboardRightColumn)[
            SETTINGS.echo.focus.settingIndex
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
        SETTINGS.echo.showButtonIcon = false
        setTimeout(() => {
          SETTINGS.echo.editHotkeyMode = false
          SETTINGS.echo.showButtonIcon = true
          SETTINGS.echo.preventEditHotkeyMode = false
        }, 50)
      }
    }
  },
  updateCurrentSettingsTab() {
    SETTINGS.echo.currentTab = SETTINGS.tabList[SETTINGS.echo.tabIndex]
  },
  updateShowAnySettingsPanel() {
    if (GLOBAL.context !== "interface") SETTINGS.echo.showPanel = false
    if (GLOBAL.context === "interface" && LAST.context !== "interface") {
      SETTINGS.echo.showPanel = true
    }
    if (SETTINGS.echo.tabIndex !== LAST.settingsTabIndex) {
      SETTINGS.echo.showPanel = false
      this.debouncedShowAnySettingsPanel()
    }
  },
  resetSettingsFocus() {
    if (
      (GLOBAL.context === "interface" && LAST.context !== "interface") ||
      SETTINGS.echo.tabIndex !== LAST.settingsTabIndex
    ) {
      SETTINGS.echo.focus.columnIndex = 0
      SETTINGS.echo.focus.settingIndex = 0
    }
  },
  updateSettingsFocus() {
    if (SETTINGS.echo.editHotkeyMode) return
    let leftColumnLength = 0
    let rightColumnLength = 0
    if (SETTINGS.echo.currentTab === "keyboard") {
      leftColumnLength = _.keys(SETTINGS.keyboardLeftColumn).length
      rightColumnLength = _.keys(SETTINGS.keyboardRightColumn).length
    } else if (SETTINGS.echo.currentTab === "gamepad") {
      leftColumnLength = _.keys(SETTINGS.gamepadLeftColumn).length
      rightColumnLength = _.keys(SETTINGS.gamepadRightColumn).length
    }
    let maxSettingIndex = 0
    if (SETTINGS.echo.focus.columnIndex === 0) {
      maxSettingIndex = leftColumnLength - 1
    } else {
      maxSettingIndex = rightColumnLength - 1
    }
    if (INPUT.gamepad.justPressed.includes("Down")) {
      SETTINGS.echo.focus.settingIndex++
      if (SETTINGS.echo.focus.settingIndex > maxSettingIndex) {
        SETTINGS.echo.focus.settingIndex = 0
      }
    }
    if (INPUT.gamepad.justPressed.includes("Up")) {
      SETTINGS.echo.focus.settingIndex--
      if (SETTINGS.echo.focus.settingIndex < 0) {
        SETTINGS.echo.focus.settingIndex = maxSettingIndex
      }
    }
    // left and right are the same while there is only two columns
    if (
      INPUT.gamepad.justPressed.includes("Right") ||
      INPUT.gamepad.justPressed.includes("Left")
    ) {
      if (
        SETTINGS.echo.focus.columnIndex === 0 &&
        rightColumnLength - 1 >= SETTINGS.echo.focus.settingIndex
      ) {
        SETTINGS.echo.focus.columnIndex = 1
      } else if (
        SETTINGS.echo.focus.columnIndex === 1 &&
        leftColumnLength - 1 >= SETTINGS.echo.focus.settingIndex
      ) {
        SETTINGS.echo.focus.columnIndex = 0
      }
    }
  },
  debouncedShowAnySettingsPanel: _.debounce(() => {
    SETTINGS.echo.showPanel = true
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
export const INTERFACE = LIBRARY.resonateObject(inter)
