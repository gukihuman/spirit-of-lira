export const Frame = defineStore("frame", {
  state: () => ({
    // controlled by @/composables/gameLoop
    current: 0,
  }),
})
