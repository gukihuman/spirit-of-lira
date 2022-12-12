export const mouseStore = defineStore("mouse", {
  state: () => ({
    x: 0,
    y: 0,
    prevX: 0,
    prevY: 0,
  }),
});
