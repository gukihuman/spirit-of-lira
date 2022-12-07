export const mouseStore = defineStore("mouse", {
  state: () => ({
    // controlled by @/composables/mouseAPI
    x: 0,
    y: 0,
  }),
});
