class Loop {
  fps = CONFIG.maxFPS // precisely updated each loop
  elapsedMS = 0
  get elapsedSec() {
    return Math.floor(this.elapsedMS / 1000)
  }
  /** @returns 1/60 for 60 fps, 1/144 for 144 fps with delta correction */
  get deltaSec() {
    if (!WORLD.app) return
    return WORLD.app.ticker.deltaMS / 16.66 / 60
  }
  newSec = false
  /** name is used to find priority in CONFIG.process, if exists */
  add = (fn: () => void, name?: string) => {
    if (!WORLD.app) return
    if (name && CONFIG && CONFIG.priority.modulesProcess[name]) {
      WORLD.app.ticker.add(fn, undefined, CONFIG.priority.modulesProcess[name])
      return
    }
    WORLD.app.ticker.add(fn)
  }
  init() {
    const holdFrames = 20
    const lastFramesFPS: number[] = []
    this.add(() => {
      if (!WORLD.app) return
      lastFramesFPS.push(WORLD.app.ticker.FPS)
      if (lastFramesFPS.length > holdFrames) lastFramesFPS.shift()
      this.fps = _.mean(lastFramesFPS)
      this.elapsedMS += WORLD.app.ticker.deltaMS
      if (LAST.loopSec !== this.elapsedSec) this.newSec = true
      else this.newSec = false
    })
    if (!WORLD.app) return
    WORLD.app.ticker.maxFPS = CONFIG.maxFPS
  }
}
export const LOOP = new Loop()
