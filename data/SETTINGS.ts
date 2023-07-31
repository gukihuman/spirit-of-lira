class settings {
  //
  inputEvents = {
    keyboard: {
      moveOrCast: "o",
      autoMouseMove: "e",
      toggleInventory: "i",
      toggleFullscreen: "f",
      sendInput: "Enter",
      lockTarget: "u",
    },
    mouse: {
      moveOrCast: 0,
      lockTarget: 2,
    },
    gamepad: {
      cast: "A",
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
      INPUT.mouse.pressed.includes(this.inputEvents.mouse.moveOrCast) ||
      INPUT.keyboard.pressed.includes(this.inputEvents.keyboard.moveOrCast)
    ) {
      EVENTS.emitSingle("mouseMove")
      GLOBAL.autoMouseMove = false
    }
    if (INPUT.gamepad.pressed.includes(this.inputEvents.gamepad.cast)) {
      EVENTS.emitSingle("cast")
    }
  }

  init() {
    WORLD.loop.add(() => {
      this.emitEvents()
    }, "SETTINGS")
  }
}

export const SETTINGS = new settings()
