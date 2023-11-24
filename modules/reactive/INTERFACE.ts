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
      opacity: number
      scale: number
    }
    startMS: number
  }
}
interface Inter extends AnyObject {
  damageOverlays: DamageOverlay[]
}
const inter: Inter = {
  overlay: true,
  damageOverlays: [],
  floatDamage: true,
  damageLifetimeMS: 1200,
  inventory: false,
  settings: false,
  settingsTabList: ["general", "gamepad", "keyboard", "info"],
  settingsTabIndex: 0,
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
  process() {
    if (GLOBAL.context === "scene") this.overlay = false
    else this.overlay = true
    this.floatDamage = SETTINGS.general.floatDamage
    this.showKeys = SETTINGS.general.showKeys
    if (GLOBAL.context !== "scene") {
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
    this.switchSettingsTab()
    this.processFloatDamage()
  },
  init() {
    EVENTS.onSingle("switchSettingsTabLeft", () => {
      const last = this.settingsTabList.length - 1
      this.settingsTabIndex--
      if (this.settingsTabIndex < 0) this.settingsTabIndex = last
    })
    EVENTS.onSingle("switchSettingsTabRight", () => {
      const last = this.settingsTabList.length - 1
      this.settingsTabIndex++
      if (this.settingsTabIndex > last) this.settingsTabIndex = 0
    })
  },
  switchSettingsTab() {
    if (!this.settings) return
    if (INPUT.gamepad.justPressed.includes("LB")) {
      EVENTS.emitSingle("switchSettingsTabLeft")
    }
    if (INPUT.gamepad.justPressed.includes("RB")) {
      EVENTS.emitSingle("switchSettingsTabRight")
    }
  },
  processFloatDamage() {
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
      const timeToScale = this.damageLifetimeMS * 0.3
      const timeToAppear = this.damageLifetimeMS * 0.15
      const timeToStartDissapear = this.damageLifetimeMS * 0.8
      const timeToDissapear = this.damageLifetimeMS * 0.2 // based on 0.8
      if (elapsed < timeToAppear) {
        overlay.screen.opacity = elapsed / timeToAppear
      }
      if (elapsed > timeToStartDissapear) {
        overlay.screen.opacity =
          1 - (elapsed - timeToStartDissapear) / timeToDissapear
      }
      if (elapsed < timeToScale) {
        const scaleDiff = overlay.screen.scale - 1 // to achieve 1 and not 0
        overlay.screen.scale = 1 + scaleDiff * (1 - elapsed / timeToScale)
      }
    })
  },
}
export const INTERFACE = LIBRARY.store(inter)
