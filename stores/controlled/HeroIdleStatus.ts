export const HeroIdleStatus = defineStore("heroIdleStatus", {
  state: () => ({
    // controlled by @/composables/idleAnim
    idleIdleB: null,
    idleBIdle: null,
  }),
})
