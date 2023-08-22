class Events {
  list: { [event: string]: Array<(AnyObject) => void> } = {
    damage: [],
    equip: [],
    unequip: [],
    cast: [],
    revenge: [],
    // scenes
    startScene: [],
  }
  listOfSingle: { [event: string]: Array<() => void> } = {
    toggleInventory: [],
    toggleFullscreen: [],
    toggleCollision: [],
    toggleEditMode: [],
    cast1: [],
    cast2: [],
    cast3: [],
    cast4: [],
    moveOrCast1: [],
    mouseMove: [],
    autoMouseMove: [],
    gamepadMove: [],
    lockTarget: [],
    // scenes
    endScene: [],
    continue: [],
  }
  active: [string, AnyObject][] = []
  activeSingle: string[] = []
  /** Add logic to an event. Function must have data argument. If data not required, use onSingle instead. */
  on(event: string, fn: (data: AnyObject) => void) {
    const eventFunctions = this.list[event]
    if (!eventFunctions) {
      LIB.logWarning(`Unknown event on: "${event}" (EVENTS)`)
      return
    }
    eventFunctions.push(fn)
  }
  /** Adds logic to an event. Single events execute only ones per loop no matter how many times emitted. Logic function must have no arguments. */
  onSingle(event: string, fn: () => void) {
    const eventFunctions = this.listOfSingle[event]
    if (!eventFunctions) {
      LIB.logWarning(`Unknown single event on: "${event}" (EVENTS)`)
      return
    }
    eventFunctions.push(fn)
  }
  emit(event: string, data: AnyObject) {
    if (!this.list[event]) {
      LIB.logWarning(`Unknown event on emit: "${event}" (EVENTS)`)
      return
    }
    this.active.push([event, data])
  }
  /** Executes only once per loop no matter how many times emitted. */
  emitSingle(event: string) {
    if (!this.listOfSingle[event]) {
      LIB.logWarning(`Unknown single event emit: "${event}" (EVENTS)`)
      return
    }
    if (this.activeSingle.includes(event)) return
    this.activeSingle.push(event)
  }
  init() {
    WORLD.loop.add(() => {
      this.executeEventsTries = 0
      this.executeEvents()
      this.active = []
      this.activeSingle = []
    }, "EVENTS")
  }
  private executeEventsTries = 0
  private limit = 10
  private activeLength = 0
  private activeSingleLength = 0
  private executeEvents() {
    this.executeEventsTries++
    if (this.executeEventsTries > this.limit) {
      LIB.logWarning(`Chain of emitted events exceeds ${this.limit} (EVENTS)`)
      return
    }
    this.activeLength = this.active.length
    this.activeSingleLength = this.activeSingle.length
    this.active.forEach((eventTuple) => {
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
      if (!this.listOfSingle[event]) {
        LIB.logWarning(`Unknown single event: "${event}" (EVENTS)`)
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
