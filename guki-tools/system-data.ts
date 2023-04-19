class systemData {
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
}
export const gsd = new systemData()
