export const Canvas = defineStore("canvas", {
  state: () => ({
    width: 1920,
    height: 1080,

    // controlled by CanvasWrapper
    context: null,
  }),
})
