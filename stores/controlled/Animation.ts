export const Animation = defineStore("animation", {
  state: () => ({
    // controlled by @/composables/idleAnim
    hero: {
      idleSwitchFrames: {
        idleIdleB: null,
        idleBIdle: null,
      },
    },
  }),
})
