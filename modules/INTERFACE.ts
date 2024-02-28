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
    talk_POSs: Position[]
}
let health_delay = 500
let target_health_delayed_token = ""
let hero_health_delayed_token = ""
let frozen_target_health_delayed = true
let frozen_hero_health_delayed = true
const inter: Inter = {
    overlay: true,
    damageOverlays: [],
    floatDamage: true,
    damageLifetimeMS: 1200,
    target: false,
    targetLocked: false,
    targetHealth: 0,
    target_health_delayed: 0,
    targetMaxHealth: 0,
    talk: false,
    talk_POSs: [],
    closest_talk_ent_i: 0,
    talkEntity: "",
    buttonHover: false,
    showKeys: true,
    heroHealth: 0,
    hero_health_delayed: 0,
    heroMaxHealth: 0,
    heroEnergy: 0,
    heroMaxEnergy: 0,
    init() {
        this.hero_health_delayed = HERO.ent.ATTRIBUTES.health
    },
    process() {
        if (CONTEXT.echo.novel) this.overlay = false
        else this.overlay = true
        this.floatDamage = SETTINGS.echo.general.floatDamage
        this.showKeys = SETTINGS.echo.general.showKeys
        if (!CONTEXT.echo.novel) {
            if (HERO.ent.TARGET.id && HERO.ent.TARGET.ent) {
                INTERFACE.target = true
                INTERFACE.targetHealth = HERO.ent.TARGET.ent.ATTRIBUTES.health
                const last_target_entity = WORLD.last.entities.get(
                    HERO.ent.TARGET.id
                )
                if (HERO.ent.TARGET.id !== HERO.last.ent.TARGET.id) {
                    INTERFACE.target_health_delayed = INTERFACE.targetHealth
                }
                if (
                    last_target_entity &&
                    Math.abs(
                        HERO.ent.TARGET.ent.ATTRIBUTES.health -
                            last_target_entity.ATTRIBUTES.health
                    ) > 1
                ) {
                    frozen_target_health_delayed = true
                    TIME.cancel(target_health_delayed_token)
                    target_health_delayed_token = TIME.after(
                        health_delay,
                        () => {
                            frozen_target_health_delayed = false
                        }
                    )
                }
                INTERFACE.targetMaxHealth =
                    ENTITIES.collection[
                        HERO.ent.TARGET.ent.name
                    ].ATTRIBUTES.health
            } else {
                INTERFACE.target = false
            }
            INTERFACE.heroHealth = HERO.ent.ATTRIBUTES.health
            if (
                Math.abs(
                    HERO.ent.ATTRIBUTES.health - HERO.last.ent.ATTRIBUTES.health
                ) > 1
            ) {
                frozen_hero_health_delayed = true
                TIME.cancel(hero_health_delayed_token)
                hero_health_delayed_token = TIME.after(health_delay, () => {
                    frozen_hero_health_delayed = false
                })
            }
            INTERFACE.heroMaxHealth = HERO.ent.ATTRIBUTES.healthMax
            INTERFACE.heroEnergy = HERO.ent.ATTRIBUTES.energy
            INTERFACE.heroMaxEnergy = HERO.ent.ATTRIBUTES.energyMax
            if (HERO.ent.TARGET.locked) INTERFACE.targetLocked = true
            else INTERFACE.targetLocked = false
        }
        // slowly transition delayed health
        if (!frozen_target_health_delayed) {
            const d = INTERFACE.targetHealth - INTERFACE.target_health_delayed
            if (d > 0) {
                INTERFACE.target_health_delayed = INTERFACE.targetHealth
            } else if (
                INTERFACE.target_health_delayed > INTERFACE.targetHealth
            ) {
                INTERFACE.target_health_delayed -=
                    INTERFACE.targetMaxHealth * 0.5 * LOOP.delta_sec
            }
        }
        if (!frozen_hero_health_delayed) {
            const d = INTERFACE.heroHealth - INTERFACE.hero_health_delayed
            if (d > 0) {
                INTERFACE.hero_health_delayed = INTERFACE.heroHealth
            } else if (INTERFACE.hero_health_delayed > INTERFACE.heroHealth) {
                INTERFACE.hero_health_delayed -=
                    INTERFACE.heroMaxHealth * 0.5 * LOOP.delta_sec
            }
        }
        // fload damage
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
