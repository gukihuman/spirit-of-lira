export function generateEntityId(entity) {
  if (Entity().entitiesIds.length == 0) {
    entity.id = 0
  } else {
    entity.id = Math.max(...Entity().entitiesIds) + 1
  }
  Entity().entitiesIds.push(entity.id)
}
