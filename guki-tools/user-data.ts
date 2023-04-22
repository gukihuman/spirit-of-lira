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
}
export const gud = new UserData()
