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
      },
      mouse: {
        mouseMove: 0,
      },
      gamepad: {
        fullscreen: "Menu",
        inventory: "Start",
        sendInput: "LB",
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
    _.forEach(this.settings.inputSignals, (settingList, device) => {
      _.forEach(settingList, (button, setting) => {
        if (gic[device].justPressed.includes(button)) {
          gsignal.emit(setting)
        }
      })
    })

    if (
      gic.mouse.pressed.includes(this.settings.inputSignals.mouse.mouseMove) ||
      gic.keyboard.pressed.includes(
        this.settings.inputSignals.keyboard.mouseMove
      )
    ) {
      gsignal.emit("mouseMove")
      gsd.states.autoMouseMove = false
    }

    if (gsd.states.autoMouseMove) gsignal.emit("mouseMove")

    gic.gamepad.axes.forEach((axis: number) => {
      if (Math.abs(axis) > this.settings.inputOther.gamepad.deadZone) {
        gsignal.emit("gamepadMove")
      }
    })
  }

  init() {
    gpixi.tickerAdd(() => {
      this.emitSignals()
    }, "gud")
  }
}

export const gud = new UserData()
