//
class Events {
  //
  list: { [event: string]: ((AnyObject) => void) | undefined } = {
    damage: undefined,
  }
  listOfSingle: { [event: string]: Array<() => void> } = {
    toggleInventory: [],
    toggleFullscreen: [],
    toggleCollision: [],
    toggleEditMode: [],
    attack: [],
    mouseMoveOrAttack: [],
    mouseMove: [],
    autoMouseMove: [],
    gamepadMove: [],
    lockTarget: [],
    sendInput: [],
  }

  active: [string, AnyObject][] = []
  activeSingle: string[] = []

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
  /** Declare logic of event once. Function must have options argument. If options not required, use onSingle instead. */
  on(event: string, fn: (options: AnyObject) => void) {
    //
    if (this.list[event]) {
      LIB.logWarning(`Event logic already declared: "${event}" (EVENTS)`)
      return
    }
    this.list[event] = fn
  }
  /** Adds logic to an event. Single events execute only ones per loop no matter how many times emitted. Logic function must have no arguments. */
  onSingle(event: string, fn: () => void) {
    //
    if (!this.listOfSingle[event]) {
      LIB.logWarning(`Unknown event: "${event}" (EVENTS)`)
      return
    }
    this.listOfSingle[event].push(fn)
  }
  emit(event: string, options: AnyObject) {
    //
    this.active.push([event, options])
  }
  /** Executes only ones per loop no matter how many times emitted. */
  emitSingle(event: string) {
    //
    if (this.activeSingle.includes(event)) return

    this.activeSingle.push(event)
  }
  private executeEvents() {
    this.active.forEach((eventTuple) => {
      //
      const event = eventTuple[0]
      const options = eventTuple[1]

      const eventFn = this.list[event]

      if (!eventFn) {
        LIB.logWarning(
          `Unknown event or logic is not defined: "${event}" (EVENTS)`
        )
        return
      }
      eventFn(options)
    })
    this.activeSingle.forEach((event) => {
      //
      if (!this.listOfSingle[event]) {
        LIB.logWarning(`Unknown single event: "${event}" (EVENTS)`)
        return
      }
      this.listOfSingle[event].forEach((fn) => fn())
    })
  }
}

export const EVENTS = new Events()
