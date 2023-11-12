class Events {
  list: { [event: string]: Array<(AnyObject) => void> } = {}
  listOfSingle: { [event: string]: Array<() => void> } = {}
  active: [string, AnyObject][] = []
  activeSingle: string[] = []
  /** Add logic to an event. Function must have data argument. If data not required, use onSingle instead. */
  on(event: string, fn: (data: AnyObject) => void) {
    if (!this.list[event]) this.list[event] = []
    this.list[event].push(fn)
  }
  /** Adds logic to an event. Single events execute only ones per loop no matter how many times emitted. Logic function must have no arguments. */
  onSingle(event: string, fn: () => void) {
    if (!this.listOfSingle[event]) this.listOfSingle[event] = []
    this.listOfSingle[event].push(fn)
  }
  emit(event: string, data: AnyObject) {
    if (!this.list[event]) this.list[event] = []
    this.active.push([event, data])
  }
  /** Executes only once per loop no matter how many times emitted. */
  emitSingle(event: string) {
    if (!this.listOfSingle[event]) this.listOfSingle[event] = []
    if (this.activeSingle.includes(event)) return
    this.activeSingle.push(event)
  }
  init() {
    LOOP.add(() => {
      this.executeEventsTries = 0
      this.executeEvents()
      this.active = []
      this.activeSingle = []
    }, "EVENTS")
    this.addCommonEvents()
  }
  private addCommonEvents() {
    this.onSingle("closeApp", () => {
      setTimeout(() => {
        _.remove(PROGRESS.scenes, (s) => s === "a0") // keep adult check
        SAVE.update()
      }, 20)
      setTimeout(() => close(), 100)
    })
  }
  private executeEventsTries = 0
  private limit = 10
  private activeLength = 0
  private activeSingleLength = 0
  private executeEvents() {
    this.executeEventsTries++
    if (this.executeEventsTries > this.limit) {
      LIBRARY.logWarning(
        `Chain of emitted events exceeds ${this.limit} (EVENTS)`
      )
      return
    }
    this.activeLength = this.active.length
    this.activeSingleLength = this.activeSingle.length
    this.active.forEach((eventTuple) => {
      const event = eventTuple[0]
      const data = eventTuple[1]
      const eventFunctions = this.list[event]
      if (!eventFunctions) {
        LIBRARY.logWarning(
          `Unknown event or logic is not defined: "${event}" (EVENTS)`
        )
        return
      }
      eventFunctions.forEach((fn) => fn(data))
    })
    this.activeSingle.forEach((event) => {
      if (!this.listOfSingle[event]) {
        LIBRARY.logWarning(`Unknown single event: "${event}" (EVENTS)`)
        return
      }
      this.listOfSingle[event].forEach((fn) => fn())
    })
    if (
      this.activeLength !== this.active.length ||
      this.activeSingleLength !== this.activeSingle.length
    ) {
      this.active.splice(0, this.activeLength)
      this.activeSingle.splice(0, this.activeSingleLength)
      this.executeEvents()
    }
  }
}

export const EVENTS = new Events()
