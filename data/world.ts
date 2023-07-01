class World {
  entities: Map<number, any> = new Map()
  systems: Map<string, any> = new Map()

  async init() {
    await this.setupSystems()

    GPIXI.tickerAdd(() => {
      this.entityProcess()
    }, "WORLD")
  }

  // 📜 implement dynamic system process, allowing adding and removing systems
  // now its just init everything at the start
  async setupSystems() {
    const inits: Promise<void>[] = []
    const processes: { [name: string]: () => void } = {}

    STORE.systems.forEach((systemClass, name) => {
      const system = new systemClass()
      if (system.init) inits.push(system.init())
      processes[name] = () => system.process()
      WORLD.systems.set(name, system)
    })
    await Promise.all(inits)

    // processes added later, may depend on init
    _.forEach(processes, (process, name) => {
      GPIXI.tickerAdd(() => process(), name)
    })
  }

  private entityProcess() {
    this.entities.forEach((entity, id) => {
      if (entity.process) entity.process(entity, id)
    })
  }
}
export const WORLD = new World()
