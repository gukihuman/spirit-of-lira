class Local {
  inventory: AnyObject = {}
  heroPosition: AnyObject = {}
  updatePeriodMS = 3000
  lastUpdateMS = 0
  init() {
    const heroPosition = this.parse("heroPosition")
    if (heroPosition) WORLD.hero.position = heroPosition
    WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)
    WORLD.loop.add(() => this.process(), "LOCAL")
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
    this.add("heroPosition", this.heroPosition)
    this.add("inventory", this.inventory)
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