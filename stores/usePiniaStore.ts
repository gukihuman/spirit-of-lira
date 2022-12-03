export const usePiniaStore = defineStore("pinia", {
  state: () => ({
    mainWindowStyle: {
      width: 800,
      height: 450,
      top: 0,
      left: 0,
    },
    gameFrame: 0,
  }),
});
