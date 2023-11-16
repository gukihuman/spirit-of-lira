declare global {
  type DamageOverlay = {
    hero: boolean
    damage: number
    x: number
    y: number
    entityHeight: number
    screen: {
      x: number
      y: number
      randomX: number
      randomY: number
      offsetX: number
      offsetY: number
    }
    opacity: number
    startMS: number
  }
}
interface Inter extends AnyObject {
  damageOverlays: DamageOverlay[]
}
const inter: Inter = {
  overlay: true,
  damageOverlays: [],
  damage: true,
  damageLifetimeMS: 800,
  inventory: false,
  target: false,
  targetLocked: false,
  targetHealth: 0,
  targetMaxHealth: 0,
  talk: false,
  talkPosition: { x: 0, y: 0 },
  talkEntity: "",
  buttonHover: false,
  skipHover: false,
  showKeys: true,
  heroHealth: 0,
  heroMaxHealth: 0,
  heroEnergy: 0,
  heroMaxEnergy: 0,
  reset: false,
  init() {
    LOOP.add(() => {
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
        INTERFACE.heroMaxHealth = SH.hero.ATTRIBUTES.healthMax
        INTERFACE.heroEnergy = SH.hero.ATTRIBUTES.energy
        INTERFACE.heroMaxEnergy = SH.hero.ATTRIBUTES.energyMax
        if (SH.hero.TARGET.locked) INTERFACE.targetLocked = true
        else INTERFACE.targetLocked = false
      }
      if (GLOBAL.context === "scene") this.overlay = false
      else this.overlay = true
    }, "INTERFACE")
  },
  process() {
    this.damageOverlays.forEach((overlay, index) => {
      if (LOOP.elapsedMS > overlay.startMS + this.damageLifetimeMS) {
        this.damageOverlays.splice(index, 1)
      }
      const { x, y } = COORD.coordinateToScreen(overlay.x, overlay.y)
      overlay.screen.offsetX += overlay.screen.randomX * LOOP.deltaSec
      overlay.screen.offsetY += overlay.screen.randomY * LOOP.deltaSec
      overlay.screen.x = x + overlay.screen.offsetX
      overlay.screen.y = y + overlay.screen.offsetY
      const elapsed = LOOP.elapsedMS - overlay.startMS
      const halfLifeMS = this.damageLifetimeMS / 2
      if (elapsed > halfLifeMS) {
        overlay.opacity = 1 - (elapsed - halfLifeMS) / halfLifeMS
      }
    })
  },
}
export const INTERFACE = LIBRARY.store(inter)
