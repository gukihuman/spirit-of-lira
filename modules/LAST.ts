class Last {
    entities: Map<number, any> = new Map()
    hero: AnyObject = {}
    hover: AnyObject | null = {}
    scenePart = ""
    sceneName = ""
    loopSec = -1
    process() {
        if (
            (GAME_STATE.echo.scene && !GAME_STATE.last.echo?.scene) ||
            (!GAME_STATE.echo.scene && GAME_STATE.last.echo?.scene)
        ) {
            EVENTS.emitSingle("sceneContextChanged")
        }
        for (const name of CONFIG.modules) {
            const module = globalThis[name]
            if (module.last_check && module.last) {
                module.last_check.forEach((key) => {
                    if (key === "echo") {
                        // getOwnPropertyNams includes getters and setters
                        const echoKeys = Object.getOwnPropertyNames(module.echo)
                        module.last.echo = {}
                        echoKeys.forEach((echoKey) => {
                            // exclude '_pinia_store' property from cloning, it's a manually chosen echo property to save an internal reactive pinia store
                            if (echoKey === "_pinia_store") return
                            module.last.echo[echoKey] = LIBRARY.clone(
                                module.echo[echoKey]
                            )
                        })
                    } else {
                        module.last[key] = LIBRARY.clone(module[key])
                    }
                })
            }
        }
        // 📜 old ones, rework and remove :)
        this.entities = LIBRARY.clone(WORLD.entities)
        this.hero = _.cloneDeep(HERO.entity)
        this.hover = _.cloneDeep(WORLD.hover)
        this.scenePart = SCENE.echo.part
        this.sceneName = SCENE.echo.name
        this.loopSec = LOOP.elapsed_sec
    }
}
export const LAST = new Last()
