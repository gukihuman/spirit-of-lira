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
    target: false,
    targetLocked: false,
    targetHealth: 0,
    targetMaxHealth: 0,
    talk: false,
    talkPOS: { x: 0, y: 0 },
    talkEntity: "",
    buttonHover: false,
    showKeys: true,
    heroHealth: 0,
    heroMaxHealth: 0,
    heroEnergy: 0,
    heroMaxEnergy: 0,
    process() {
        if (CONTEXT.echo.novel) this.overlay = false
        else this.overlay = true
        this.floatDamage = SETTINGS.general.floatDamage
        this.showKeys = SETTINGS.general.showKeys
        if (!CONTEXT.echo.novel) {
            if (HERO.ent.TARGET.id && HERO.ent.TARGET.ent) {
                INTERFACE.target = true
                INTERFACE.targetHealth = HERO.ent.TARGET.ent.ATTRIBUTES.health
                INTERFACE.targetMaxHealth =
                    ENTITIES.collection[
                        HERO.ent.TARGET.ent.name
                    ].ATTRIBUTES.health
            } else {
                INTERFACE.target = false
            }
            INTERFACE.heroHealth = HERO.ent.ATTRIBUTES.health
            INTERFACE.heroMaxHealth = HERO.ent.ATTRIBUTES.healthMax
            INTERFACE.heroEnergy = HERO.ent.ATTRIBUTES.energy
            INTERFACE.heroMaxEnergy = HERO.ent.ATTRIBUTES.energyMax
            if (HERO.ent.TARGET.locked) INTERFACE.targetLocked = true
            else INTERFACE.targetLocked = false
        }
        this.processFloatDamage()
    },

    processFloatDamage() {
        this.damageOverlays.forEach((overlay, index) => {
            if (LOOP.elapsed > overlay.startMS + this.damageLifetimeMS) {
                this.damageOverlays.splice(index, 1)
            }
            const { x, y } = COORD.coordinateToScreen(overlay.x, overlay.y)
            overlay.screen.offsetX += overlay.screen.randomX * LOOP.delta_sec
            overlay.screen.offsetY += overlay.screen.randomY * LOOP.delta_sec
            overlay.screen.x = x + overlay.screen.offsetX
            overlay.screen.y = y + overlay.screen.offsetY
            const elapsed = LOOP.elapsed - overlay.startMS
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
                overlay.screen.scale =
                    1 + scaleDiff * (1 - elapsed / timeToScale)
            }
        })
    },
}
export const INTERFACE = LIBRARY.resonateObject(inter)
