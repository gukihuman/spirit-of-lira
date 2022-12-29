export const Map = defineStore("map", {
  state: () => ({
    // controlled by @/components/collision
    collision: [],

    // controlled by @/composables/movement
    offset: [0, 0],

    // controlled by @/composables/mapAPI
    offsetDelay: [0, 0],
  }),
})
