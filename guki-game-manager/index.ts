//
class GukiGameManager {
  private _refs = defineStore("ref", {
    state: (): {
      [index: string]: any
    } => ({
      //
      // To switch fullscreen
      background: undefined,
      //
      // To initialize pixi with
      viewport: undefined,
    }),
  })

  public get refs() {
    return this._refs()
  }
}
export const ggm = new GukiGameManager()
