export function generateEntityId(entity) {
  if (OldEntity().entitiesIds.length == 0) {
    entity.id = 0
  } else {
    entity.id = Math.max(...OldEntity().entitiesIds) + 1
  }
  OldEntity().entitiesIds.push(entity.id)
}
