//
const inventory: AnyObject = {
  //
  equipped: {
    cloth: undefined,
    weapon: "common-sword",
  },
  bag: {
    clothes: [],
    weapons: [],
  },

  init() {
    //
    initEvents()

    let { equipped, bag } = LOCAL.get("inventory")
    this.equipped = equipped ?? this.equipped
    this.bag = bag ?? this.bag

    if (this.equipped.cloth) {
      SPRITE.createItemSprite(this.equipped.cloth, "cloth")
    }
    if (this.equipped.weapon) {
      SPRITE.createItemSprite(this.equipped.weapon, "weapon")
    }
  },
}
function initEvents() {
  EVENTS.onSingle("toggleInventory", () => {
    INTERFACE.inventory = !INTERFACE.inventory
  })
  EVENTS.on("equip", (data) => {
    //
    const { singular, plural } = getType(data.name)

    if (!singular || !plural) {
      LIB.logWarning(`"${data.name}" not found on equip (INVENTORY)`)
      return
    }
    const lastWeapon = INVENTORY.equipped[singular]

    INVENTORY.bag[plural].push(lastWeapon)

    _.remove(INVENTORY.bag[plural], (item) => item === data.name)

    INVENTORY.equipped[singular] = data.name

    if (singular === "weapon") SPRITE.emptyWeaponLayers()
    if (singular === "cloth") SPRITE.emptyClothLayer()

    SPRITE.createItemSprite(data.name, singular)

    LOCAL.update()
  })
  EVENTS.on("unequip", (data) => {
    //
    const { singular, plural } = getType(data.name)

    if (!singular || !plural) {
      LIB.logWarning(`"${data.name}" not found on unequip (INVENTORY)`)
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
  //
  let singular
  let plural

  if (_.keys(ITEMS.weapons).includes(name)) {
    //
    singular = "weapon"
    plural = "weapons"
  }
  if (_.keys(ITEMS.clothes).includes(name)) {
    //
    singular = "cloth"
    plural = "clothes"
  }
  return { singular, plural }
}
export const INVENTORY = LIB.store(inventory)
