class PixiGuki {
  //
  // app has to be initiated when window object exist
  app?: Application
  elapsedMS: number = 0

  map = new PIXI.Container()
  ground = new PIXI.Container()
  collision = new PIXI.Container()
  sortable = new PIXI.Container()

  /** Name is used to find priority in config, if exist. */
  tickerAdd(fn, name?: string) {
    if (!this.app) return
    if (name && CONFIG.priority.toolsAndSystems[name])
      this.app.ticker.add(fn, undefined, CONFIG.priority.toolsAndSystems[name])
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
    for (let child of PIXI_GUKI.sortable.children) {
      const gContainer = child as gContainer
      if (gContainer.id === id) return child as gContainer
    }
    for (let child of PIXI_GUKI.ground.children) {
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

  async getSpritesheet(name: string): Promise<gSpritesheet | undefined> {
    let json = STORE.jsons.get(name)

    if (!json) {
      LIB.logWarning(`no json for ${name} in STORE.jsons (PIXI_GUKI)`)
      return
    }

    // lazy guard for an ISpritesheetData type of json
    if (!json.animations || !json.frames || !json.meta) return

    let texture
    let spritesheet

    if (!PIXI.Cache.has(name)) {
      if (!STORE.jsons.get(name)) return
      texture = PIXI.Texture.from(json.meta.image)
      spritesheet = new PIXI.Spritesheet(texture, json as ISpritesheetData)
      PIXI.Cache.set(name, [texture, spritesheet])
    } else {
      texture = PIXI.Cache.get(name)[0]
      spritesheet = PIXI.Cache.get(name)[1]
    }

    // adds gParse function as a non-cache alternative to parse
    LIB.addParseWithoutCaching(spritesheet)

    await spritesheet.gParse()

    return spritesheet
  }
}

export const PIXI_GUKI = new PixiGuki()
