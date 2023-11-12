const inter = {
  overlay: true,
  inventory: false,
  target: false,
  targetLocked: false,
  targetHealth: 0,
  targetMaxHealth: 0,
  talk: false,
  talkPosition: { x: 0, y: 0 },
  talkEntity: "",
  talkHover: false,
  skipHover: false,
  showKeys: true,
  heroHealth: 0,
  heroMaxHealth: 0,
  init() {
    WORLD.loop.add(() => {
      if (GLOBAL.context === "world") {
        if (SH.hero.TARGET.id && SH.hero.TARGET.entity) {
          INTERFACE.target = true
          INTERFACE.targetHealth = SH.hero.TARGET.entity.ATTRIBUTES.health
          INTERFACE.targetMaxHealth =
            ENTITIES.collection[SH.hero.TARGET.entity.name].ATTRIBUTES.health
        } else {
          INTERFACE.target = false
        }
        INTERFACE.heroHealth = SH.hero.ATTRIBUTES.health
        INTERFACE.heroMaxHealth =
          ENTITIES.collection[SH.hero.name].ATTRIBUTES.health
        if (SH.hero.TARGET.locked) INTERFACE.targetLocked = true
        else INTERFACE.targetLocked = false
      }
      if (GLOBAL.context === "scene") this.overlay = false
      else this.overlay = true
    }, "INTERFACE")
  },
}
export const INTERFACE = LIBRARY.store(inter)
