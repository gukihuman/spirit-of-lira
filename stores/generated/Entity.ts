export const Entity = defineStore("entity", {
  state: () => ({
    // controlled by @/composables/generateEntity
    entities: [],
    entitiesIds: [],
  }),
})
