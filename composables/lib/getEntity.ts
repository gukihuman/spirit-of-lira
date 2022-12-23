export function getEntity(id: number) {
  return Game().entities.find((entity) => entity.id === id)
}
