class World {
  entities: Map<number, any> = new Map()
  systems: Map<string, any> = new Map()

  async init() {
    await this.setupSystems()

    gpixi.tickerAdd(() => {
      this.entityProcess()
    }, "gworld")
  }

  // 📜 implement dynamic system process, allowing adding and removing systems
  // now its just init everything at the start
  async setupSystems() {
    const inits: Promise<void>[] = []
    const processes: { [name: string]: () => void } = {}

    gstorage.systems.forEach((systemClass, name) => {
      const system = new systemClass()
      if (system.init) inits.push(system.init())
      processes[name] = () => system.process()
      gworld.systems.set(name, system)
    })
    await Promise.all(inits)

    // processes added later, may depend on init
    _.forEach(processes, (process, name) => {
      gpixi.tickerAdd(() => process(), name)
    })
  }

  private entityProcess() {
    this.entities.forEach((entity, id) => {
      if (entity.process) entity.process(entity, id)
    })
  }
}
export const gworld = new World()
