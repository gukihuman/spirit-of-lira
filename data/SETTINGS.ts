class Settings {
  inputEvents = {
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
      sendInput: "Enter",
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
  inputOther = {
    gamepad: {
      deadZone: 0.15,
    },
  }
  gameplay = {
    // turn on auto target for mouse and continue attack after kill for both mouse and gamepad
    easyFight: false,
    attackBack: false,
  }

  constructor() {
    LIB.store(this.inputEvents)
    LIB.store(this.inputOther)
  }

  emitEvents() {
    if (LIB.deadZoneExceed(this.inputOther.gamepad.deadZone)) {
      EVENTS.emitSingle("gamepadMove")
    }

    if (INTERFACE.inputFocus) return

    _.forEach(this.inputEvents, (settingList, device) => {
      _.forEach(settingList, (button, setting) => {
        if (INPUT[device].justPressed.includes(button)) {
          EVENTS.emitSingle(setting)
        }
      })
    })

    // overwrite default
    if (
      INPUT.mouse.pressed.includes(this.inputEvents.mouse.moveOrCast1) ||
      INPUT.keyboard.pressed.includes(this.inputEvents.keyboard.moveOrCast1)
    ) {
      EVENTS.emitSingle("moveOrCast1")
      GLOBAL.autoMouseMove = false
    }
    if (
      INPUT.gamepad.pressed.includes(this.inputEvents.gamepad.cast1) ||
      INPUT.keyboard.pressed.includes(this.inputEvents.keyboard.cast1)
    ) {
      EVENTS.emitSingle("cast1")
    }
    if (
      INPUT.gamepad.pressed.includes(this.inputEvents.gamepad.cast2) ||
      INPUT.keyboard.pressed.includes(this.inputEvents.keyboard.cast2)
    ) {
      EVENTS.emitSingle("cast2")
    }
    if (
      INPUT.gamepad.pressed.includes(this.inputEvents.gamepad.cast3) ||
      INPUT.keyboard.pressed.includes(this.inputEvents.keyboard.cast3)
    ) {
      EVENTS.emitSingle("cast3")
    }
    if (
      INPUT.gamepad.pressed.includes(this.inputEvents.gamepad.cast4) ||
      INPUT.keyboard.pressed.includes(this.inputEvents.keyboard.cast4)
    ) {
      EVENTS.emitSingle("cast4")
    }
    if (INPUT.lastActiveDevice === "gamepad") GLOBAL.autoMouseMove = false
  }

  init() {
    WORLD.loop.add(() => {
      this.emitEvents()
    }, "SETTINGS")
  }
}

export const SETTINGS = new Settings()
