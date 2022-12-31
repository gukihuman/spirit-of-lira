export function eachSec(sec: number, random: boolean = false): boolean {
  if (random) {
    return (
      Math.floor(Math.random() * Pixi().app.ticker.FPS * sec) ===
      Math.floor(Math.random() * Pixi().app.ticker.FPS * sec)
    )
  } else {
    return Pixi().ticks % l.round(Pixi().app.ticker.FPS * sec, -1) === 0
  }
}
