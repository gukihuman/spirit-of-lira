class Dead {
    init() {
        EVENTS.onSingle("reset", () => {
            if (HERO.ent.STATE.active !== "dead" || !GLOBAL.reset) return
            HERO.ent.STATE.cast = false
            HERO.ent.STATE.track = false
            HERO.ent.STATE.idle = true
            HERO.ent.STATE.active = "idle"
            HERO.ent.ATTRIBUTES.health = HERO.ent.ATTRIBUTES.healthMax
            HERO.ent.ATTRIBUTES.energy = HERO.ent.ATTRIBUTES.energyMax
            HERO.ent.POS = _.cloneDeep(ENTITIES.collection.lira.POS)
            HERO.ent.TARGET.id = null
            HERO.ent.TARGET.locked = false
            HERO.reset_final_des()
            GLOBAL.reset = false
            const container = SPRITE.getContainer(HERO.id)
            if (!container) return
            container.setParent(WORLD.sortable)
            container.alpha = 0
            const fadeInStart = 100 // otherwise there is a dead state flickers
            const fadeInDuration = 500
            const totalDuration = fadeInStart + fadeInDuration
            const updateInterval = 7
            let elapsed = 0
            const intervalId = setInterval(() => {
                elapsed += updateInterval
                if (elapsed > fadeInStart && elapsed < totalDuration) {
                    const fractionComplete =
                        (elapsed - fadeInStart) / fadeInDuration
                    container.alpha = fractionComplete
                } else if (elapsed > totalDuration) {
                    container.alpha = 1
                    clearInterval(intervalId)
                }
            }, 7)
            SPRITE.fillWeaponLayers()
        })
    }
    process() {
        MUSEUM.process_entity("HERO", (ent, id) => {
            if (ent.ATTRIBUTES.health > 0) return
            ent.STATE.active = "dead"
            ent.TARGET.id = null
            ent.TARGET.locked = false
            SPRITE.emptyWeaponLayers()
            const lastEntity = WORLD.last.entities.get(id)
            if (
                ent.STATE.active === "dead" &&
                lastEntity.STATE.active !== "dead"
            ) {
                setTimeout(() => (GLOBAL.reset = true), 2500)
                SAVE.update()
                setTimeout(() => {
                    if (ent.STATE.active !== "dead") return
                    const container = SPRITE.getContainer(id)
                    if (!container) return
                    container.setParent(WORLD.ground)
                }, 1000)
            }
        })
        MUSEUM.process_entity(["ATTRIBUTES", "STATE", "NONHERO"], (ent, id) => {
            if (ent.ATTRIBUTES.health > 0) return
            ent.STATE.active = "dead"
            ent.TARGET.id = undefined
            const lastEntity = WORLD.last.entities.get(id)
            if (
                ent.STATE.active === "dead" &&
                lastEntity.STATE.active !== "dead"
            ) {
                TIME.cancel(ent.SKILLS.attackSoundTimeId)
                ent.STATE.deadTimeMS = LOOP.elapsed
                PROGRESS.mobs[ent.name]++
                SAVE.update()
            }
            const animation = SPRITE.getLayer(id, "animation")
            const shadow = SPRITE.getLayer(id, "shadow")
            if (!animation || !shadow) return
            // fade
            const timeTillRemove =
                ent.STATE.deadTimeMS + ent.STATE.deadDelayMS - LOOP.elapsed
            animation.alpha = timeTillRemove / 500
            if (timeTillRemove < 500) {
                ent.POS.y += 0.5 * (60 / LOOP.fps)
            }
            shadow.alpha = (timeTillRemove / 500) * CONFIG.shadow_alpha
        })
    }
}
export const DEAD = new Dead()
