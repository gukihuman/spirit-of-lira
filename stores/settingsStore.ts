export const settingsStore = defineStore("settings", {
  state: () => ({
    frameRate: 60,
    canvasPhysicOffset: 0.2,
  }),
});
