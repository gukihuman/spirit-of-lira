export const Mouse = defineStore("mouse", {
  state: () => ({
    x: 0,
    y: 0,
    offsetX: 0,
    offsetY: 0,
    prevX: 0,
    prevY: 0,
  }),
})
