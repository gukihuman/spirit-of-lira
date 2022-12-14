export const Canvas = defineStore("canvas", {
  state: () => ({
    width: 1920,
    height: 1080,

    // controlled by CanvasWrapper
    context: null,

    // controlled by canvasAPI
    entities: [
      // {
      //   breed: hero,
      //   x: 0,
      //   y: 0,
      //   mirrored: false,
      // }
    ],
  }),
})
