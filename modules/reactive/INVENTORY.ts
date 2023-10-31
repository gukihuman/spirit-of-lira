const inventory: AnyObject = {
  equipped: {
    cloth: undefined,
    weapon: "common-sword",
  },
  bag: {
    clothes: [],
    weapons: [],
  },
  init() {
    initEvents()
    if (this.equipped.cloth) {
      SPRITE.item(this.equipped.cloth, "cloth")
    }
    if (this.equipped.weapon) {
      SPRITE.item(this.equipped.weapon, "weapon")
    }
  },
}
function initEvents() {
  EVENTS.onSingle("toggleInventory", () => {
    INTERFACE.inventory = !INTERFACE.inventory
  })
  EVENTS.on("equip", (data) => {
    const { singular, plural } = getType(data.name)
    if (!singular || !plural) {
      LIBRARY.logWarning(`"${data.name}" not found on equip (INVENTORY)`)
      return
    }
    const lastWeapon = INVENTORY.equipped[singular]
    INVENTORY.bag[plural].push(lastWeapon)
    _.remove(INVENTORY.bag[plural], (item) => item === data.name)
    INVENTORY.equipped[singular] = data.name
    if (singular === "weapon") SPRITE.emptyWeaponLayers()
    if (singular === "cloth") SPRITE.emptyClothLayer()
    SPRITE.item(data.name, singular)
    LOCAL.update()
  })
  EVENTS.on("unequip", (data) => {
    const { singular, plural } = getType(data.name)
    if (!singular || !plural) {
      LIBRARY.logWarning(`"${data.name}" not found on unequip (INVENTORY)`)
      return
    }
    INVENTORY.equipped[singular] = undefined
    INVENTORY.bag[plural].push(data.name)
    if (singular === "weapon") SPRITE.emptyWeaponLayers()
    if (singular === "cloth") SPRITE.emptyClothLayer()
    LOCAL.update()
  })
}
function getType(name: string) {
  let singular
  let plural
  if (_.keys(ITEMS.weapons).includes(name)) {
    singular = "weapon"
    plural = "weapons"
  }
  if (_.keys(ITEMS.clothes).includes(name)) {
    singular = "cloth"
    plural = "clothes"
  }
  return { singular, plural }
}
export const INVENTORY = LIBRARY.store(inventory)
