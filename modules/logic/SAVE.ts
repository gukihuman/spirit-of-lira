class Save {
  startSave: AnyObject = {}
  save: AnyObject = {}
  updatePeriodMS = 3000
  lastUpdateMS = 0
  init() {
    const storageSave = this.parseLocal("save") || this.save
    this.startSave = {
      version: GLOBAL.version,
      hero: {
        position: WORLD.hero.position,
      },
      inventory: {
        bag: INVENTORY.bag,
        gear: INVENTORY.gear,
      },
      progress: {
        scenes: PROGRESS.scenes,
      },
    }
    // takes start save and fill it with storage values recursively
    // storage keys that dosnt exist in start save are simply removed for now
    // in the future we might add logic for specific versions of storage save
    this.save = this.resolveSaves(this.startSave, storageSave)

    WORLD.hero.position = this.save.hero.position
    INVENTORY.bag = this.save.inventory.bag
    INVENTORY.gear = this.save.inventory.gear
    PROGRESS.scenes = this.save.progress.scenes

    SH.stopHero() // update final destination otherwise hero run at the start
  }
  update() {
    // clone deep is important especially with pinia stores
    this.save.hero.position = _.cloneDeep(WORLD.hero.position)
    this.save.inventory.bag = _.cloneDeep(INVENTORY.bag)
    this.save.inventory.gear = _.cloneDeep(INVENTORY.gear)
    this.save.progress.scenes = _.cloneDeep(PROGRESS.scenes)
    this.stringifyLocal("save", this.save)
  }
  process() {
    if (WORLD.loop.elapsedMS > this.lastUpdateMS + this.updatePeriodMS) {
      this.update()
      this.lastUpdateMS = WORLD.loop.elapsedMS
    }
  }
  private parseLocal(key: string) {
    const data = localStorage.getItem(key)
    if (!data) return
    return JSON.parse(data)
  }
  stringifyLocal(key: string, data: AnyObject) {
    localStorage.setItem(key, JSON.stringify(data))
  }
  private resolveSaves(start, storage) {
    let resolved = {}
    _.forEach(start, (value, key) => {
      if (storage.hasOwnProperty(key)) {
        if (LIBRARY.isPureObject(value)) {
          resolved[key] = this.resolveSaves(value, storage[key])
        } else if (typeof value === typeof storage[key]) {
          resolved[key] = storage[key]
        } else {
          resolved[key] = value
        }
      } else {
        resolved[key] = value
      }
    })
    return resolved
  }
}
export const SAVE = new Save()
