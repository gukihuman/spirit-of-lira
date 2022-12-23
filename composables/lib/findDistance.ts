export function findDistance(entity1, entity2) {
  if (entity1 && entity2) {
    const dx = Math.abs(entity2.x - entity1.x)
    const dy = Math.abs(entity2.y - entity1.y)
    return Math.sqrt(dx ** 2 + dy ** 2)
  }
}
