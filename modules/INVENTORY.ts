const inventory: AnyObject = {
    gear: {
        cloth: null,
        weapon: "common-sword",
    },
    bag: {
        clothes: [],
        weapons: [],
    },
    init() {
        initEvents()
        SPRITE.fillWeaponLayers()
        SPRITE.fillClothLayer()
    },
}
function initEvents() {
    EVENTS.onSingle("toggleInventory", () => {
        if (GAME_STATE.echo.world?.interface?.inventory) {
            GAME_STATE.set("world")
        } else {
            GAME_STATE.set("world", "interface")
        }
    })
    EVENTS.onSingle("toggleSettings", () => {
        if (GAME_STATE.echo.world?.interface?.settings) {
            GAME_STATE.set("world")
        } else {
            GAME_STATE.set("world", "interface", "settings")
        }
    })
    EVENTS.onSingle("toggleSkills", () => {
        if (GAME_STATE.echo.world?.interface?.skills) {
            GAME_STATE.set("world")
        } else {
            GAME_STATE.set("world", "interface", "skills")
        }
    })
    EVENTS.on("equip", (data) => {
        const { singular, plural } = getType(data.name)
        if (!singular || !plural) {
            LIBRARY.logWarning(`"${data.name}" not found on equip (INVENTORY)`)
            return
        }
        const lastWeapon = INVENTORY.gear[singular]
        INVENTORY.bag[plural].push(lastWeapon)
        _.remove(INVENTORY.bag[plural], (item) => item === data.name)
        INVENTORY.gear[singular] = data.name
        if (singular === "weapon") SPRITE.emptyWeaponLayers()
        if (singular === "cloth") SPRITE.emptyClothLayer()
        SPRITE.item(data.name, singular)
        SAVE.update()
    })
    EVENTS.on("unequip", (data) => {
        const { singular, plural } = getType(data.name)
        if (!singular || !plural) {
            LIBRARY.logWarning(
                `"${data.name}" not found on unequip (INVENTORY)`
            )
            return
        }
        INVENTORY.gear[singular] = undefined
        INVENTORY.bag[plural].push(data.name)
        if (singular === "weapon") SPRITE.emptyWeaponLayers()
        if (singular === "cloth") SPRITE.emptyClothLayer()
        SAVE.update()
    })
}
function getType(name: string) {
    let singular
    let plural
    if (_.keys(ITEMS.collection.weapons).includes(name)) {
        singular = "weapon"
        plural = "weapons"
    }
    if (_.keys(ITEMS.collection.clothes).includes(name)) {
        singular = "cloth"
        plural = "clothes"
    }
    return { singular, plural }
}
export const INVENTORY = LIBRARY.resonateObject(inventory)
