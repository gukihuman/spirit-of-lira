function generateRandomString(length) {
  let result = ""
  for (let i = 0; i < length; i++) {
    // Generate a random number between 0 and 9
    const randomNumber = _.random(0, 9)
    // Convert the number to a string and add it to the result
    result += randomNumber.toString()
  }
  return result
}
const glib: any = {}
glib.store = (
  object: { [index: string]: any },
  ...args: [string, (newValue?, oldValue?) => any][]
) => {
  return defineStore(generateRandomString(10), () => {
    const state = _.mapValues(object, (key) => ref(key))

    args.forEach((watcher) => {
      watch(state[watcher[0]], watcher[1])
    })

    return state
  })
}

class SystemData {
  //

  private _refs = glib.store({
    background: undefined, // to switch fullscreen
    viewport: undefined, // to init pixi and gic
    input: undefined,
    output: undefined,
  })
  get refs() {
    return this._refs()
  }
  private _states = glib.store(
    {
      gameWindowScale: 1,
      fullscreen: false,
      loadingScreen: true,
      devMode: false,
      context: "gameplay",
      inputFocus: false,
    },
    [
      "fullscreen",
      () => {
        if (gsd.refs.background && !document.fullscreenElement) {
          gsd.refs.background.requestFullscreen()
        } else if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      },
    ]
  )
  get states() {
    return this._states()
  }
  init() {
    gpixi.tickerAdd(() => {
      if (gim.signals.fullscreen) {
        gsd.states.fullscreen = !gsd.states.fullscreen
      }
    }, "gsd")
  }
}
export const gsd = new SystemData()
