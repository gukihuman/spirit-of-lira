class DevMode {
    process() {
        if (GLOBAL.dev_env) {
            if (INPUT.keyboard.justPressed.includes("z")) {
                EVENTS.emitSingle("toggleEditMode")
            }
            if (INPUT.keyboard.justPressed.includes("k")) {
                EVENTS.emitSingle("toggleCollision")
            }
            if (INPUT.keyboard.justPressed.includes("l")) {
                console.log(WORLD.hover)
            }
            globalThis.reset = () => SAVE.reset()
            globalThis.kill = () => (HERO.entity.ATTRIBUTES.health -= Infinity)

            globalThis.log = () => {
                return INTERFACE.damageOverlays
            }
        }
    }
}
export const DEVMODE = new DevMode()
