export function findDistance(x, y, targetX, targetY) {
  const dx = Math.abs(targetX - x)
  const dy = Math.abs(targetY - y)
  return Math.sqrt(dx ** 2 + dy ** 2)
}
