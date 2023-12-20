class GukiConfig {
    // automatically loaded from modules folder by load.ts
    modules: string[] = [] // ["WORLD", "GLOBAL", ...]
    components: string[] = [] // ["ATTTRIBUTES", "MOVE", ...]
    // setup 0 priority for unmentioned values
    init() {
        this.components.forEach((name) => {
            if (this.priority.componentInject[name]) return
            this.priority.componentInject[name] = 0
        })
        this.modules.forEach((name) => {
            if (this.priority.modulesInit[name] || name === "CONFIG") return
            this.priority.modulesInit[name] = 0
        })
    }
    // higher values goes first, what is not setted here will be 0
    priority = {
        componentInject: {
            SPRITE: 2,
            MOVE: 1,
            // <- rest of the logic
        },
        modulesInit: {
            // CONFIG init is always first, handled separatly in start.ts
            CONTEXT: 7,
            ENTITIES_STATIC: 6,
            ENTITIES: 5,
            WORLD: 4,
            HERO: 4,
            SAVE: 3, // before NOVEL but after WORLD
            NOVEL: 2,
            COLLISION: 2,
            ASTAR: 1,
            // <- rest of the logic
        },
        modulesProcess: {
            ASTAR: 10,
            INPUT_UPDATE: 6, // at least SETTINGS and INTERFACE depends on it
            STATE: 5,
            SPRITE_UPDATE: 4,
            NOVEL: 3,
            DEVMODE: 3, // between STATE and LAST
            SETTINGS: 3, // before LAST
            CONTEXT: 3, // before LAST
            LAST: 2,
            // <- rest of the logic here
            EVENTS: -2, // runs all logic for collected events and empty itself
            AUDIO: -3, // after EVENTS to check game states
            MOVE: -3,
            CAST: -4,
            TARGET: -5,
            DEAD: -6, // remove target after TARGET so dead hero cant target :)
            FLIP: -7,
            TIME: -8,
        },
    }
    viewport = {
        width: 1920,
        height: 1080,
    }
    max_fps = 60
    novel = {
        textBoxWidth: 700,
        textBoxHeight: 220,
        choiceBoxWidth: 550,
        choiceBoxHeight: 80,
        choiceSectionMarginY: 30,
        border: 10,
        unfocusedChoiceBoxOpacity: 0.3,
        focusedChoiceBoxOpacity: 0.65,
        textSpeed: 70,
        transitionSpeed: 700,
        skipDelay: 300,
    }
    shadow_alpha = 0.12
}
export const CONFIG = new GukiConfig()
