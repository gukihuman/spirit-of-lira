class UserData {
  //
  private _settings = glib.store({
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
        sendInput: { keyboard: { tap: "Enter" } },
      },
    },
  })
  get settings() {
    return this._settings()
  }

  public init() {
    if (gsd.states.devMode) {
      this.settings.input.states.editingCollision = {
        keyboard: { tap: "m" },
      }
    }
  }
}
export const gud = new UserData()
