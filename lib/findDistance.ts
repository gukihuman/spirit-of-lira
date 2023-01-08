interface Entity {
  x: number
  y: number
}
interface Options {
  optimized: boolean
}
export function findDistance(
  entity1: Entity,
  entity2: Entity,
  options: Options = {
    optimized: false,
  }
): number {
  const dx = Math.abs(entity1.x - entity2.x)
  const dy = Math.abs(entity1.y - entity2.y)
  let rawDistance: number = dx ** 2 + dy ** 2

  if (options.optimized) return rawDistance
  else return Math.sqrt(rawDistance)
}
