class PixiManager {
  //
  // app has to be initiated when window object exist
  app?: Application
  elapsedMS: number = 0

  map = new PIXI.Container()
  ground = new PIXI.Container()
  collision = new PIXI.Container()
  sortable = new PIXI.Container()

  // higher values goes first, takes tools and systems
  // almost everything is 0, which is default if not set explicitly
  private tickerPriority = {
    gcache: 3,
    gic: 2, // at least gud depends on it
    gsignal: 1, // runs all logic for collected signals and empty itself

    gflip: -1,
    state: -2,
    render: -3,
  }

  /** Name is used to find ticker priority in pixi private property, if exist. */
  tickerAdd(fn, name?: string) {
    if (!this.app) return
    if (name && this.tickerPriority[name])
      this.app.ticker.add(fn, undefined, this.tickerPriority[name])
    else this.app.ticker.add(fn)
  }

  /** Initializes the PIXI application, adds map, ground, collision, and sortable to the stage. Sets up sorting for the sortable container. Run the timer of elapsedMS.
  @param viewport - HTML element to append the app.view to.
  @param width - default is 1920.
  @param height - default is 1080.
  */
  init(viewport: HTMLElement, width: number = 1920, height: number = 1080) {
    //
    this.app = new PIXI.Application({ width, height })
    viewport.appendChild(this.app.view as any) // any to fix pixi.js issue
    globalThis.__PIXI_APP__ = this.app

    for (let name of ["map", "ground", "collision", "sortable"]) {
      this[name].name = name
      this.app.stage.addChild(this[name])
    }

    this.tickerAdd(() => this.sortable.children.sort((a, b) => a.y - b.y))
    this.tickerAdd(() => {
      if (!this.app) return
      this.elapsedMS += this.app.ticker.deltaMS
    })
  }

  /**
   * Multiplier ratio of one tick iteration for values that suppose to represent one second. Knows current framerate and handles all inconsistancy in frames.
   * @returns 1/60 for 60 fps, 1/144 for 144 fps
   */
  get deltaSec() {
    if (!this.app) return 1 / 60
    return this.app.ticker.deltaMS / 16.66 / 60
  }

  // 📜 need those getters? think yes but have doubts

  getContainer(id: number): gContainer | undefined {
    for (let child of gpixi.sortable.children) {
      const gContainer = child as gContainer
      if (gContainer.id === id) return child as gContainer
    }
    for (let child of gpixi.ground.children) {
      const gContainer = child as gContainer
      if (gContainer.id === id) return child as gContainer
    }
    return undefined
  }

  getAnimationContainer(id: number): gContainer | undefined {
    const entityContainer = this.getContainer(id)
    return entityContainer?.getChildByName("animations") as gContainer
  }

  getAnimationSprite(id: number, state: string): AnimatedSprite | undefined {
    const animationsContainer = this.getAnimationContainer(id) as gContainer
    return animationsContainer.getChildByName(state) as AnimatedSprite
  }
}

export const gpixi = new PixiManager()
