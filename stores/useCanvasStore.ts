export const useCanvasStore = defineStore("canvas", {
  state: () => ({
    // controlled by @/components/CanvasWrapper.ts
    width: 1920,
    height: 1080,
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
});
