class World {
  // has to be initiated when window DOM object exist
  app?: Application
  entities: Map<number, any> = new Map()
  systems: AnyObject = {}
  // shortcuts for often used entities
  hero: AnyObject = {}
  heroId = 0
  // 📜 rewrite in one line
  isHero(id: number) {
    if (id === this.heroId) return true
    return false
  }
  hover: AnyObject = {}
  hoverId = 0
  // layers
  map = new PIXI.Container()
  ground = new PIXI.Container()
  sortable = new PIXI.Container()
  collision = new PIXI.Container()
  loop = {
    fps: CONFIG.maxFPS, // precisely updated each loop
    elapsedMS: 0,
    elapsedSec: 0, // switched to getter
    newSec: false,
    // switched to precise getter on init that includes delta fluctuations
    /** @returns 1/60 for 60 fps, 1/144 for 144 fps */
    deltaSec: 1 / CONFIG.maxFPS,
    /** name is used to find priority in CONFIG.process, if exists */
    add: (fn: () => void, name?: string) => {
      if (!this.app) return
      if (name && CONFIG && CONFIG.priority.modulesProcess[name]) {
        this.app.ticker.add(fn, undefined, CONFIG.priority.modulesProcess[name])
        return
      }
      this.app.ticker.add(fn)
    },
  }
  async init() {
    const width = CONFIG.viewport.width
    const height = CONFIG.viewport.height
    this.app = new PIXI.Application({ width, height })
    // app.view must be type of "any" for proper work with ts (pixiJS issue)
    REFS.viewport.appendChild(this.app.view as any)
    this.loopSetup()
    // PIXI dev tools work with this constant
    globalThis.__PIXI_APP__ = this.app
    const layers = ["map", "ground", "sortable", "collision"]
    for (let name of layers) {
      this.app.stage.addChild(this[name])
      // name attribute is used by PIXI dev tools to show containers with proper names
      this[name].name = name
    }
    this.loop.add(() => {
      this.sortable.children.sort((a, b) => a.y - b.y)
      this.entities.forEach((entity, id) => {
        if (entity.process) entity.process(entity, id)
      })
    }, "WORLD")
    // hero creation
    let heroId = await CREATOR.create("lira")
    if (!heroId) {
      LIB.logWarning("hero is not created (starter)")
      return
    }
    WORLD.hero = WORLD.entities.get(heroId)
    WORLD.heroId = heroId
  }
  private loopSetup() {
    const holdFrames = 20
    const lastFramesFPS: number[] = []
    this.loop.add(() => {
      if (!this.app) return
      lastFramesFPS.push(this.app.ticker.FPS)
      if (lastFramesFPS.length > holdFrames) lastFramesFPS.shift()
      this.loop.fps = _.mean(lastFramesFPS)
      this.loop.elapsedMS += this.app.ticker.deltaMS
      if (LAST.loopSec !== this.loop.elapsedSec) this.loop.newSec = true
      else this.loop.newSec = false
    })
    Object.defineProperty(this.loop, "deltaSec", {
      get: () => {
        if (!this.app) return
        return this.app.ticker.deltaMS / 16.66 / 60
      },
    })
    Object.defineProperty(this.loop, "elapsedSec", {
      get: () => {
        if (!this.app) return
        return Math.floor(this.loop.elapsedMS / 1000)
      },
    })
    if (!this.app) return
    this.app.ticker.maxFPS = CONFIG.maxFPS
  }
}
export const WORLD = new World()
