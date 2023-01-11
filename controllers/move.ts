interface Entity {
  x: number
  y: number
  size: number
  speed: number
}
class Move {
  input(entity: Entity) {
    if (input.pad.axesActive) {
      entity.x += ((entity.speed * 10) / pixi.fps) * input.pad.axes[0]
      entity.y += ((entity.speed * 10) / pixi.fps) * input.pad.axes[1]
      States().heroMove = false
    } else if (States().heroMove && input.mouse.distanceToHero > entity.size) {
      let speedRatio = input.mouse.distanceToHero / 350
      speedRatio = l.clamp(speedRatio, 1)
      entity.x +=
        ((entity.speed * 10) / pixi.fps) *
        speedRatio *
        Math.cos(input.mouse.angleToHero) *
        -1
      entity.y +=
        ((entity.speed * 10) / pixi.fps) *
        speedRatio *
        Math.sin(input.mouse.angleToHero) *
        -1
    }
  }
}
export const move = new Move()
