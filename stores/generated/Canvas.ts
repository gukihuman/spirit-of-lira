export const Canvas = defineStore("canvas", {
  state: () => ({
    // controlled by @/components/CanvasWrapper.ts
    width: 0,
    height: 0,
    context: null,
    // controlled by @/composables/canvasAPI.ts
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
