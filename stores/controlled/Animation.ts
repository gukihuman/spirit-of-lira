export const Animation = defineStore("animation", {
  state: () => ({
    // controlled by @/composables/idleAnim
    idleAnim: true,
    switchFrames: {
      idleIdleB: null,
      idleBIdle: null,
    },
  }),
})
