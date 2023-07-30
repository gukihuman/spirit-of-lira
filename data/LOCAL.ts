//
class Local {
  //
  inventory: AnyObject = {}
  heroPosition: AnyObject = {}

  updatePeriodMS = 3000
  lastUpdateMS = 0

  init() {
    //
    const heroPosition = this.get("heroPosition")
    WORLD.hero.position = heroPosition ?? WORLD.hero.position
    WORLD.hero.move.finaldestination = _.cloneDeep(WORLD.hero.position)

    WORLD.loop.add(() => {
      //
      this.process()
      //
    }, "LOCAL")
  }
  update() {
    //
    this.inventory.list = INVENTORY.list
    this.inventory.eqipped = INVENTORY.eqipped
    this.heroPosition = WORLD.hero.position

    this.add("heroPosition", this.heroPosition)
    this.add("inventory", this.inventory)
  }
  process() {
    //
    if (WORLD.loop.elapsedMS > this.lastUpdateMS + this.updatePeriodMS) {
      //
      this.update()

      this.lastUpdateMS = WORLD.loop.elapsedMS
    }
  }

  add(key: string, data) {
    //
    localStorage.setItem(key, JSON.stringify(data))
  }

  get(key: string) {
    //
    const data = localStorage.getItem(key)
    if (!data) return
    return JSON.parse(data)
  }
}

export const LOCAL = new Local()
