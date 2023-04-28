interface Options {
  random: boolean
}
export function eachSec(sec: number = 1, options: Options = { random: false }) {
  if (options.random) {
    return (
      _.floor(Math.random() * pixi.fps * sec) ===
      _.floor(Math.random() * pixi.fps * sec)
    )
  } else {
    // round is needed cause pixi.fps is not an integer
    return pixi.tick % _.round(pixi.fps * sec, -1) === 0
  }
}
