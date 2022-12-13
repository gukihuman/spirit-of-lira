export const mapStore = defineStore("map", {
  state: () => ({
    // controlled by @/components/collision
    collision: [],

    // controlled by @/composables/movement
    mapOffset: [0, 0],

    // controlled by @/composables/mapAPI
    mapOffsetDelay: [0, 0],
  }),
});
