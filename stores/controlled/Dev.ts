interface Dev {
  selectedCreature: number
}

export const Dev = defineStore("dev", {
  state: (): Dev => ({
    // controlled by Dev components
    selectedCreature: NaN,
  }),
})
