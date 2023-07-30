//
class Events {
  //
  list: { [event: string]: Array<(AnyObject) => void> } = {
    damage: [],
    equip: [],
    unequip: [],
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
  /** Add logic to an event. Function must have data argument. If data not required, use onSingle instead. */
  on(event: string, fn: (data: AnyObject) => void) {
    //
    const eventFunctions = this.list[event]

    if (!eventFunctions) {
      LIB.logWarning(`Unknown event: "${event}" (EVENTS)`)
      return
    }
    eventFunctions.push(fn)
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
  emit(event: string, data: AnyObject) {
    //
    this.active.push([event, data])
  }
  /** Executes only once per loop no matter how many times emitted. */
  emitSingle(event: string) {
    //
    if (this.activeSingle.includes(event)) return

    this.activeSingle.push(event)
  }
  private executeEvents() {
    this.active.forEach((eventTuple) => {
      //
      const event = eventTuple[0]
      const data = eventTuple[1]

      const eventFunctions = this.list[event]

      if (!eventFunctions) {
        LIB.logWarning(
          `Unknown event or logic is not defined: "${event}" (EVENTS)`
        )
        return
      }
      eventFunctions.forEach((fn) => fn(data))
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
