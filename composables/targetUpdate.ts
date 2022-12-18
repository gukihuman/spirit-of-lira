export function targetUpdate() {
  Game().entities.forEach((entity) => {
    let minDistance = Infinity
    Game().entities.forEach((targetEntity) => {
      if (targetEntity.type != entity.type) {
        const x = Math.abs(targetEntity.x - entity.x) - targetEntity.size * 0.8
        const y = Math.abs(targetEntity.y - entity.y) - targetEntity.size * 0.8
        const distance = x * x + y * y
        if (distance < minDistance) {
          entity.targetId = targetEntity.id
          entity.targetDistance = distance
          minDistance = distance
        }
      }
    })
    entity.targetDistance = Math.sqrt(entity.targetDistance)
  })
}
