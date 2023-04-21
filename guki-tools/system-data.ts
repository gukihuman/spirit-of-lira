class systemData {
  //
  private _refs = defineStore("refs", () => {
    const raw: { [index: string]: any } = {
      //
      background: undefined, // To switch fullscreen
      viewport: undefined, // To initialize pixi and gic with
    }
    const state = _.mapValues(raw, (key) => ref(key))
    return state
  })
  public get refs() {
    return this._refs()
  }

  private _states = defineStore("states", () => {
    const raw: { [index: string]: any } = {
      //
      gameWindowScale: 1,
      fullscreen: false,
      assetsLoaded: false,
    }
    const state = _.mapValues(raw, (key) => ref(key))

    watch(state.fullscreen, () => {
      if (gsd.refs.background && !document.fullscreenElement) {
        gsd.refs.background.requestFullscreen()
      } else if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    })

    return state
  })
  public get states() {
    return this._states()
  }
  public initialize() {
    gpm.app?.ticker.add(() => {
      // 📜 add user settings
      if (gic.keyboard.justPressed.includes("w")) {
        gsd.states.fullscreen = !gsd.states.fullscreen
      }
    })
  }
}
export const gsd = new systemData()
