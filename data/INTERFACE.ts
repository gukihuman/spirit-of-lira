//
const inter = {
  //
  target: false,
  targetLocked: false,
  inventory: false,
  input: false,
  inputFocus: false,
  targetHealth: 0,

  init() {
    EVENTS.onSingle("toggleInventory", () => {
      this.inventory = !this.inventory
    })
  },
}
export const INTERFACE = LIB.store(inter)
