class World {
  //
  // has to be initiated when window DOM object exist
  app?: Application

  entities: Map<number, any> = new Map()
  systems: { [name: string]: any } = {}

  // layers
  map = new PIXI.Container()
  ground = new PIXI.Container()
  collision = new PIXI.Container()
  sortable = new PIXI.Container()

  entityContainers: Map<number, Container> = new Map()

  loop = {
    averageFPS: 0,
    elapsedMS: 0,

    // switched to precise getter on init
    deltaSec: 1 / CONFIG.maxFPS,

    /** name is used to find priority in CONFIG.systemProcess, if exists */
    add: (fn: () => void, name?: string) => {
      if (!this.app) return

      if (name && CONFIG && CONFIG.priority.systemProcess[name]) {
        this.app.ticker.add(fn, undefined, CONFIG.priority.systemProcess[name])
        return
      }
      this.app.ticker.add(fn)
    },
  }

  init(viewport: HTMLElement, width: number = 1920, height: number = 1080) {
    //
    this.app = new PIXI.Application({ width, height })

    // app.view must be type of "any" for proper work with ts (pixiJS issue)
    viewport.appendChild(this.app.view as any)

    this.loopSetup()

    // PIXI dev tools work with this constant
    globalThis.__PIXI_APP__ = this.app

    for (let name of ["map", "ground", "collision", "sortable"]) {
      this.app.stage.addChild(this[name])

      // name attribute is used by PIXI dev tools
      // to show containers with proper names
      this[name].name = name
    }

    this.loop.add(() => this.sortable.children.sort((a, b) => a.y - b.y))
  }

  private loopSetup() {
    //
    const lastTicks: number[] = []

    this.loop.add(() => {
      if (!this.app) return

      lastTicks.push(this.app.ticker.FPS)
      if (lastTicks.length > 100) lastTicks.shift()

      this.loop.averageFPS = _.mean(lastTicks)
      this.loop.elapsedMS += this.app.ticker.deltaMS
    })

    Object.defineProperty(this.loop, "deltaSec", {
      //
      /** @returns 1/60 for 60 fps, 1/144 for 144 fps */
      get: () => {
        if (!this.app) return 1 / 60

        return this.app.ticker.deltaMS / 16.66 / 60
      },
    })

    if (!this.app) return

    this.app.ticker.maxFPS = CONFIG.maxFPS
  }

  getContainer(id: number): Container | undefined {
    //
    return this.entityContainers.get(id)
  }

  getLayer(id: number, layer: EntityLayer): Container | undefined {
    //
    const entityContainer = this.getContainer(id)
    return entityContainer?.getChildByName(layer) as Container
  }

  getSprite(
    id: number,
    animation: string = "idle"
  ): AnimatedSprite | undefined {
    const middleContainer = this.getLayer(id, "middle") as Container
    return middleContainer.getChildByName(animation) as AnimatedSprite
  }

  async getSpritesheet(name: string): Promise<gSpritesheet | undefined> {
    let json = ASSETS.jsons.get(name)

    if (!json) {
      LIB.logWarning(`no json for ${name} in ASSETS.jsons (WORLD)`)
      return
    }

    // lazy guard for an ISpritesheetData type of json
    if (!json.animations || !json.frames || !json.meta) return

    let texture
    let spritesheet

    if (!PIXI.Cache.has(name)) {
      if (!ASSETS.jsons.get(name)) return
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

export const WORLD = new World()
