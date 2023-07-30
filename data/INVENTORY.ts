//
const inventory = {
  //
  eqipped: ["sword"],
  list: ["sword"],

  init() {
    //
    const { eqipped, list } = LOCAL.get("inventory")
    this.eqipped = eqipped ?? this.eqipped
    this.list = list ?? this.list

    EVENTS.onSingle("toggleInventory", () => {
      INTERFACE.inventory = !INTERFACE.inventory
    })
  },
}
export const INVENTORY = LIB.store(inventory)
