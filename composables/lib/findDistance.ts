interface entity {
  x: number
  y: number
}
export function findDistance(
  entity1: entity,
  entity2: entity,
  optimized: boolean = false
): number {
  const dx = Math.abs(entity1.x - entity2.x)
  const dy = Math.abs(entity1.y - entity2.y)
  let rawDistance: number = dx ** 2 + dy ** 2

  if (optimized) return rawDistance
  else return Math.sqrt(rawDistance)
}
