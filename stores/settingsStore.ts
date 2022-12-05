export const settingsStore = defineStore("settings", {
  state: () => ({
    framerate: 60,
    canvasPhysicOffset: 0.2,
    gamepadDeadZone: 0.15,
  }),
});
