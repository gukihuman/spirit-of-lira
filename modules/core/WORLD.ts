declare global {
  type Context = "world" | "scene" | "interface"
}
class World {
  app: Application | null = null // init after window DOM object exist
  entities: Map<number, any> = new Map()
  systems: AnyObject = {}
  hover: AnyObject | null = {}
  // layers
  map = new PIXI.Container()
  ground = new PIXI.Container()
  sortable = new PIXI.Container()
  collision = new PIXI.Container()
  top = new PIXI.Container()
  async init() {
    const width = CONFIG.viewport.width
    const height = CONFIG.viewport.height
    this.app = new PIXI.Application({ width, height })
    // app.view must be type of "any" for proper work with ts (pixiJS issue)
    REFS.viewport.appendChild(this.app.view as any)
    // PIXI dev tools work with this constant
    globalThis.__PIXI_APP__ = this.app
    const layers = ["map", "ground", "sortable", "collision", "top"]
    for (let name of layers) {
      this.app.stage.addChild(this[name])
      // name attribute is used by PIXI dev tools to show containers with proper names
      this[name].name = name
    }
    LOOP.add(() => {
      this.sortable.children.sort((a, b) => a.y - b.y)
      this.entities.forEach((entity, id) => {
        if (entity.process) entity.process(entity, id)
      })
    }, "WORLD")

    await CREATOR.create("lira") // here so other modules can use it on init
  }
}
export const WORLD = new World()
