const inter = {
  target: false,
  targetLocked: false,
  inventory: false,
  targetHealth: 0,
  targetMaxHealth: 0,
  // 📜 need it?
  input: false,
  inputFocus: false,
  init() {
    WORLD.loop.add(() => {
      // 📜 extend global context handling, should be here based on other states
      if (this.inventory) GLOBAL.context = "interface"
      else GLOBAL.context = "world"
      if (GLOBAL.context === "world") {
        if (WORLD.hero.target.id && WORLD.hero.target.entity) {
          INTERFACE.target = true
          INTERFACE.targetHealth = WORLD.hero.target.entity.attributes.health
          INTERFACE.targetMaxHealth =
            MODELS.entities[WORLD.hero.target.entity.name].attributes.health
        } else {
          INTERFACE.target = false
        }
        if (WORLD.hero.target.locked) INTERFACE.targetLocked = true
        else INTERFACE.targetLocked = false
      }
    }, "INTERFACE")
  },
}
export const INTERFACE = LIB.store(inter)
