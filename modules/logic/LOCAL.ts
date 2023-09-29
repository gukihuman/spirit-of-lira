class Local {
  progress: AnyObject = {}
  inventory: AnyObject = {}
  heroPosition: AnyObject = {}
  updatePeriodMS = 3000
  lastUpdateMS = 0
  init() {
    const heroPosition = this.parse("heroPosition")
    if (heroPosition) WORLD.hero.position = heroPosition
    const inventory = LOCAL.parse("inventory")
    if (inventory) {
      INVENTORY.equipped = inventory.equipped
      INVENTORY.bag = inventory.bag
    }
    const progress = LOCAL.parse("progress")
    if (progress) PROGRESS.scenes = progress.scenes
    WORLD.loop.add(() => this.process(), "LOCAL")
    setTimeout(() => {
      WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
    })
  }
  process() {
    if (WORLD.loop.elapsedMS > this.lastUpdateMS + this.updatePeriodMS) {
      this.update()
      this.lastUpdateMS = WORLD.loop.elapsedMS
    }
  }
  update() {
    this.inventory.bag = INVENTORY.bag
    this.inventory.equipped = INVENTORY.equipped
    this.heroPosition = WORLD.hero.position
    this.progress = { scenes: PROGRESS.scenes }
    this.add("heroPosition", this.heroPosition)
    this.add("inventory", this.inventory)
    this.add("progress", this.progress)
  }
  add(key: string, data) {
    localStorage.setItem(key, JSON.stringify(data))
  }
  parse(key: string) {
    const data = localStorage.getItem(key)
    if (!data) return
    return JSON.parse(data)
  }
}
export const LOCAL = new Local()
