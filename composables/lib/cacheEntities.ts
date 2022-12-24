export function cacheEntities() {
  let newEntities = []
  let newCacheEntities = []
  Game().entities.forEach((entity) => {
    let distance = findDistance(hero(), entity)
    if (distance > 1250) {
      newCacheEntities.push(entity)
    } else {
      newEntities.push(entity)
    }
  })
  Game().entitiesCache.forEach((entity) => {
    let distance = findDistance(hero(), entity)
    if (distance > 1200) {
      newCacheEntities.push(entity)
    } else {
      newEntities.push(entity)
    }
  })
  Game().entities = newEntities
  Game().entitiesCache = newCacheEntities
}
