export function generateEntityId(entity) {
  if (entityStore().entitiesIds.length == 0) {
    entity.id = 0;
  } else {
    entity.id = Math.max(...entityStore().entitiesIds) + 1;
  }
  entityStore().entitiesIds.push(entity.id);
}
