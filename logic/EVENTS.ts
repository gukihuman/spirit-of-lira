//
class Events {
  //
  active: [string, AnyObject][] = []
  activeSingle: string[] = []

  add(event: string, fn: (options: AnyObject) => void) {
    //
    this.list[event] = fn
  }
  addSingle(event: string, fn: () => void) {
    //
    this.listOfSingle[event] = fn
  }
  emit(event: string, options: AnyObject) {
    //
    this.active.push([event, options])
  }
  emitSingle(event: string) {
    //
    if (this.activeSingle.includes(event)) return

    this.activeSingle.push(event)
  }
  init() {
    //
    WORLD.loop.add(() => {
      //
      this.executeEvents()
      this.active = []
      this.activeSingle = []
      //
    }, "EVENTS")
  }
  private executeEvents() {
    this.active.forEach((eventTuple) => {
      //
      const event = eventTuple[0]
      const options = eventTuple[1]

      if (!this.list[event]) {
        LIB.logWarning(`Unknown regular event: "${event}" (EVENTS)`)
        return
      }
      this.list[event](options)
    })
    this.activeSingle.forEach((event) => {
      if (!this.listOfSingle[event]) {
        LIB.logWarning(`Unknown single event: "${event}" (EVENTS)`)
        return
      }
      this.listOfSingle[event]()
    })
  }
  list: { [event: string]: (AnyObject) => void } = {}
  listOfSingle: { [event: string]: () => void } = {}
}

export const EVENTS = new Events()
