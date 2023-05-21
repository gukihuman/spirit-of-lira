class UserData {
  //
  private _settings = glib.store({
    //
    inputSignals: {
      keyboard: {
        mouseMove: "o",
        autoMouseMove: "e",
        inventory: "i",
        fullscreen: "f",
        sendInput: "Enter",
        lockTarget: "u",
      },
      mouse: {
        mouseMove: 0,
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
    if (glib.deadZoneExceed(this.settings.inputOther.gamepad.deadZone)) {
      gsignal.emit("gamepadMove")
    }
    if (gsd.states.autoMouseMove) gsignal.emit("mouseMove")

    if (gsd.states.inputFocus) return

    _.forEach(this.settings.inputSignals, (settingList, device) => {
      _.forEach(settingList, (button, setting) => {
        if (gic[device].justPressed.includes(button)) {
          gsignal.emit(setting)
        }
      })
    })

    // overwrite mouseMove pressed instead of default
    if (
      gic.mouse.pressed.includes(this.settings.inputSignals.mouse.mouseMove) ||
      gic.keyboard.pressed.includes(
        this.settings.inputSignals.keyboard.mouseMove
      )
    ) {
      gsignal.emit("mouseMove")
      gsd.states.autoMouseMove = false
    }
  }

  init() {
    gpixi.tickerAdd(() => {
      this.emitSignals()
    }, "gud")
  }
}

export const gud = new UserData()
