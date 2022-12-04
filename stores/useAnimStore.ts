export const useAnimStore = defineStore("anim", {
  state: () => ({
    // controlled by @/composables/animSetup
    breeds: {
      // breed: {
      //   width: 0,
      //   height: 0,
      //   animSet: {
      //     walk: [[1, 1], [1, 303]]
      //     idle: [[303, 1], [303, 303]]
      //   },
      // }
    },
  }),
});
