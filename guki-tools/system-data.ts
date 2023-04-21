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
    }
    const state = _.mapValues(raw, (key) => ref(key))
    return state
  })
  public get states() {
    return this._states()
  }
}
export const gsd = new systemData()
