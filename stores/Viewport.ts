export const Viewport = defineStore("mainWindow", {
  state: () => ({
    // controlled by setViewportSize
    width: 0,
    height: 0,
    scale: 0,
  }),
})
