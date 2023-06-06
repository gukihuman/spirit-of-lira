class UserData {
  //
  private _settings = LIB.store({
    //
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
        fullscreen: "Menu",
        inventory: "Start",
        sendInput: "LB",
        lockTarget: "RT",
      },
    },
    inputOther: {
      gamepad: {
        deadZone: 0.15,
      },
    },
  })
  get settings() {
    return this._settings()
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

    // overwrite mouseMove pressed instead of default
    if (
      INPUT.mouse.pressed.includes(
        this.settings.inputSignals.mouse.mouseMoveOrAttack
      ) ||
      INPUT.keyboard.pressed.includes(
        this.settings.inputSignals.keyboard.mouseMoveOrAttack
      )
    ) {
      SIGNAL.emit("mouseMove")
      GLOBAL.context = "default"
    }
  }

  init() {
    PIXI_GUKI.tickerAdd(() => {
      this.emitSignals()
    }, "USER_DATA")
  }
}

export const USER_DATA = new UserData()
