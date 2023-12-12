declare global {
    type RootStates = keyof Root
    type WorldStates = keyof World
    type InterfaceStates = keyof Inter
    type SettingsStates = keyof Settings
    type SkillsStates = keyof Skills
}
type Root = {
    empty: boolean
    novel: boolean
    world: World | boolean
}
type World = {
    gameplay: boolean
    interface: Inter | boolean
}
type Inter = {
    inventory: boolean
    settings: Settings | boolean
    skills: Skills | boolean
}
type Settings = {
    general: boolean
    gamepad: boolean
    keyboard: boolean
    info: boolean
}
type Skills = {
    sword: boolean
    bow: boolean
    magic: boolean
}
class GameState {
    // correct resonate require full object declaration
    echo: Root = {
        empty: true,
        novel: false,
        world: {
            gameplay: false,
            interface: {
                inventory: false,
                settings: {
                    general: false,
                    gamepad: false,
                    keyboard: false,
                    info: false,
                },
                skills: {
                    sword: false,
                    bow: false,
                    magic: false,
                },
            },
        },
    }
    last = {
        echo: this.echo,
    }
    set(
        level1: RootStates,
        level2?: WorldStates,
        level3?: InterfaceStates,
        level4?: SettingsStates | SkillsStates
    ) {
        this.echo.empty = false
        this.echo.novel = false
        this.echo.world = false
        if (level1 === "empty") this.echo.empty = true
        if (level1 === "novel") this.echo.novel = true
        if (level1 === "world") {
            this.echo.world = {
                gameplay: false,
                interface: false,
            }
            if (!level2 || level2 === "gameplay")
                this.echo.world.gameplay = true
            if (level2 === "interface") {
                this.echo.world.interface = {
                    inventory: false,
                    settings: false,
                    skills: false,
                }
                const inter = this.echo.world.interface
                if (!level3 || level3 === "inventory") inter.inventory = true
                if (level3 === "settings") {
                    inter.settings = {
                        general: false,
                        gamepad: false,
                        keyboard: false,
                        info: false,
                    }
                    if (!level4 || level4 === "general")
                        inter.settings.general = true
                    if (level4 === "gamepad") inter.settings.gamepad = true
                    if (level4 === "keyboard") inter.settings.keyboard = true
                    if (level4 === "info") inter.settings.info = true
                }
                if (level3 === "skills") {
                    inter.skills = {
                        sword: false,
                        bow: false,
                        magic: false,
                    }
                    if (!level4 || level4 === "sword") inter.skills.sword = true
                    if (level4 === "bow") inter.skills.bow = true
                    if (level4 === "magic") inter.skills.magic = true
                }
            }
        }
    }
}
export const GAME_STATE = LIBRARY.resonate(new GameState())
