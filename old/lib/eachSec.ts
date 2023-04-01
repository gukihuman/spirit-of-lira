interface Options {
  random: boolean
}
export function eachSec(sec: number = 1, options: Options = { random: false }) {
  if (options.random) {
    return (
      l.floor(Math.random() * pixi.fps * sec) ===
      l.floor(Math.random() * pixi.fps * sec)
    )
  } else {
    // round is needed cause pixi.fps is not an integer
    return pixi.tick % l.round(pixi.fps * sec, -1) === 0
  }
}
