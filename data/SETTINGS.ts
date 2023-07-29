class settings {
  //
  inputEvents = {
    keyboard: {
      mouseMoveOrAttack: "o",
      autoMouseMove: "e",
      toggleInventory: "i",
      toggleFullscreen: "f",
      sendInput: "Enter",
      lockTarget: "u",
    },
    mouse: {
      mouseMoveOrAttack: 0,
      lockTarget: 2,
    },
    gamepad: {
      attack: "A",
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
      INPUT.mouse.pressed.includes(this.inputEvents.mouse.mouseMoveOrAttack) ||
      INPUT.keyboard.pressed.includes(
        this.inputEvents.keyboard.mouseMoveOrAttack
      )
    ) {
      EVENTS.emitSingle("mouseMove")
      GLOBAL.autoMouseMove = false
    }
  }

  init() {
    WORLD.loop.add(() => {
      this.emitEvents()
    }, "SETTINGS")
  }
}

export const SETTINGS = new settings()
