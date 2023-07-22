class UserData {
  //
  settings = {
    inputSignals: {
      keyboard: {
        mouseMoveOrAttack: "o",
        autoMouseMove: "e",
        inventory: "i",
        fullscreen: "f",
        sendInput: "Enter",
        lockTarget: "u",
      },
      mouse: {
        mouseMoveOrAttack: 0,
        lockTarget: 2,
      },
      gamepad: {
        attack: "A",
        fullscreen: "Menu",
        inventory: "Start",
        lockTarget: "RT",
      },
    },
    inputOther: {
      gamepad: {
        deadZone: 0.15,
      },
    },
  }

  constructor() {
    LIB.store(this.settings)
  }

  emitSignals() {
    if (LIB.deadZoneExceed(this.settings.inputOther.gamepad.deadZone)) {
      SIGNAL.emit("gamepadMove")
    }

    if (SYSTEM_DATA.states.inputFocus) return

    _.forEach(this.settings.inputSignals, (settingList, device) => {
      _.forEach(settingList, (button, setting) => {
        if (INPUT[device].justPressed.includes(button)) {
          SIGNAL.emit(setting)
        }
      })
    })

    // overwrite default
    if (
      INPUT.mouse.pressed.includes(
        this.settings.inputSignals.mouse.mouseMoveOrAttack
      ) ||
      INPUT.keyboard.pressed.includes(
        this.settings.inputSignals.keyboard.mouseMoveOrAttack
      )
    ) {
      SIGNAL.emit("mouseMove")
      SYSTEM_DATA.states.autoMouseMove = false
    }
  }

  init() {
    WORLD.loop.add(() => {
      this.emitSignals()
    }, "USER_DATA")
  }
}

export const USER_DATA = new UserData()
