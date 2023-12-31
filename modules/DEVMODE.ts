class DevMode {
    init() {
        if (GLOBAL.dev_env) {
            globalThis.log = () => INTERFACE.damageOverlays
            globalThis.reset = () => SAVE.reset_progress()
            globalThis.kill = () => (HERO.ent.ATTRIBUTES.health -= Infinity)
            globalThis.chunks = () => MAP.closeChunks
            globalThis.chunk = () => COORD.chunk_from_coordinates(HERO.ent.POS)
            globalThis.mobs = () => {
                let mobs = 0
                MUSEUM.process_entity(["NONHERO", "MOVE"], () => mobs++)
                return mobs
            }
        }
    }
    process() {
        if (GLOBAL.dev_env) {
            if (CONTEXT.echo.gameplay) {
                if (INPUT.keyboard.justPressed.includes("z")) {
                    EVENTS.emitSingle("toggleEditMode")
                }
                if (INPUT.keyboard.justPressed.includes("k")) {
                    EVENTS.emitSingle("toggleCollision")
                }
                if (INPUT.keyboard.justPressed.includes("l")) {
                    console.log(WORLD.hover)
                }
            }
        }
    }
}
export const DEVMODE = new DevMode()
