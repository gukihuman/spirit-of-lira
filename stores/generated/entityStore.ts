export const entityStore = defineStore("entity", {
  state: () => ({
    // controlled by @/composables/generateEntity
    entities: [],
    entitiesIds: [],
  }),
});
