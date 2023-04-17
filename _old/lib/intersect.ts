interface entity {
  size: number
  x: number
  y: number
}
interface Options {
  extend: number
}
export function intersect(
  entity1: entity,
  entity2: entity,
  options: Options = {
    extend: 0,
  }
): boolean {
  const intersectX =
    entity2.x - options.extend < entity1.x + entity1.size &&
    entity2.x + entity2.size > entity1.x - options.extend
  const intersectY =
    entity2.y - options.extend < entity1.y + entity1.size &&
    entity2.y + entity2.size > entity1.y - options.extend
  return intersectX && intersectY
}
