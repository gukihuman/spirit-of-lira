interface Options {
  random: boolean
}
export function eachSec(sec: number = 1, options: Options = { random: false }) {
  let fps = 60
  if (pixi.app) fps = pixi.app.ticker.FPS
  if (options.random) {
    return (
      l.floor(Math.random() * fps * sec) === l.floor(Math.random() * fps * sec)
    )
  } else {
    return pixi.tick % l.round(fps * sec, -1) === 0
  }
}
