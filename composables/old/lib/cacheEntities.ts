export function cacheEntities() {
  const heroo = hero()
  let newEntities = []
  let newCacheEntities = []
  Game().entities.forEach((entity) => {
    if (
      Math.abs(entity.x - heroo.x) > 1100 ||
      Math.abs(entity.y - heroo.y) > 700
    ) {
      newCacheEntities.push(entity)
    } else {
      newEntities.push(entity)
    }
  })
  Game().entitiesCache.forEach((entity) => {
    if (
      Math.abs(entity.x - heroo.x) > 1100 ||
      Math.abs(entity.y - heroo.y) > 700
    ) {
      newCacheEntities.push(entity)
    } else {
      newEntities.push(entity)
    }
  })
  Game().entities = newEntities
  Game().entitiesCache = newCacheEntities
}
