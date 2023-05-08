class PixiManager {
  public app?: Application

  public ground = new PIXI.Container()
  public collision = new PIXI.Container()
  public sortable = new PIXI.Container()

  // higher values goes first, 0 is default, if not set
  private tickerPriority = {
    gcache: 1,
    gflip: -1,
  }

  /** Name is used to find ticker priority in pixi private property, if exist. */
  public tickerAdd(fn, name?: string) {
    if (!this.app) return
    if (name && this.tickerPriority[name])
      this.app.ticker.add(fn, undefined, this.tickerPriority[name])
    else this.app.ticker.add(fn)
  }

  /**
  * Initializes the PIXI application, adds ground, collision, and sortable to the stage and sets up sorting for the sortable container.
  @param viewport - HTML element to append the app.view to.
  @param width - default is 1920.
  @param height - default is 1080.
  */
  public init(
    viewport: HTMLElement,
    width: number = 1920,
    height: number = 1080
  ) {
    //
    this.app = new PIXI.Application({ width, height })
    viewport.appendChild(this.app.view as any) // any to fix pixi.js issue
    globalThis.__PIXI_APP__ = this.app

    for (let name of ["ground", "collision", "sortable"]) {
      this[name].name = name
      this.app.stage.addChild(this[name])
    }

    this.tickerAdd(() => this.sortable.children.sort((a, b) => a.y - b.y))
  }

  /**
   * Multiplier ratio of one tick iteration for values that suppose to represent one second. Knows current framerate and handles all inconsistancy in frames.
   * @returns 1/60 for 60 fps, 1/144 for 144 fps
   */
  public get deltaSec() {
    if (!this.app) return 1 / 60
    return this.app.ticker.deltaMS / 16.66 / 60
  }

  public getEntityContainer(id: number): gContainer | undefined {
    for (let child of gpixi.sortable.children) {
      const gContainer = child as gContainer
      if (gContainer.id === id) return child as gContainer
    }
    return undefined
  }

  public getAnimationsContainer(id: number): gContainer | undefined {
    const entityContainer = this.getEntityContainer(id)
    return entityContainer?.getChildByName("animations") as gContainer
  }

  public getAnimationSprite(
    id: number,
    state: string
  ): AnimatedSprite | undefined {
    const animationsContainer = this.getAnimationsContainer(id) as gContainer
    return animationsContainer.getChildByName(state) as AnimatedSprite
  }
}

export const gpixi = new PixiManager()
