class UserData {
  //
  private _settings = defineStore("user-data-settings", () => {
    const raw: { [index: string]: any } = {
      //
      input: {
        gamepadDeadZone: 0.15,

        states: {
          heroMouseMove: {
            keyboard: { tap: "e", hold: "o" },
            mouse: { hold: 0 },
          },
          contextInventory: {
            keyboard: { tap: "i" },
          },

          // only for dev
          editingCollision: {},
        },

        signals: {
          fullscreen: { keyboard: { tap: "f" }, gamepad: { tap: "Start" } },
        },
      },
    }
    const state = _.mapValues(raw, (key) => ref(key))
    return state
  })
  public get settings() {
    return this._settings()
  }
  private _states = defineStore("user-data-states", () => {
    const raw: { [index: string]: any } = {
      //
    }
    const state = _.mapValues(raw, (key) => ref(key))
    return state
  })
  public get states() {
    return this._states()
  }

  public initialize() {
    // 📜 check dev state
    this.settings.input.states.editingCollision = {
      keyboard: { tap: "m" },
    }
  }
}
export const gud = new UserData()
