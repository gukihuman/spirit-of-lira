import { Application, Graphics } from "pixi.js" // for type

interface Sprites {
  hero: {
    [index: string]: any
  }
  mapChunks: {
    [index: string]: any
  }
}
class Pixi {
  app: Application | null = null
  tick = 0
  fps = 60 // updated after initialization

  map = new p.Container()
  collision = new p.Container()
  collisionGrid: Graphics[][] = []

  sortable = new p.Container()
  hero = new p.Container()

  sprites: Sprites = {
    hero: {},
    mapChunks: {},
  }
  async initialize() {
    this.app = new p.Application({ width: 1920, height: 1080 })
    this.fps = this.app.ticker.FPS
    Refs().viewport.appendChild(this.app.view)
    this.addContainers(this.app)
    await this.loadHero()
    await this.loadCloseMapChunks()
    this.drawCollisionGrid()
    this.app.ticker.add(() => ticker())
  }
  moveMap(index: string) {
    if (!l.keys(this.sprites.mapChunks).includes(index)) return

    this.sprites.mapChunks[index].x =
      (l.toNumber(index) % 100) * 1000 + 1920 / 2 - User().data.hero.x
    this.sprites.mapChunks[index].y =
      l.floor(l.toNumber(index) / 100) * 1000 + 1080 / 2 - User().data.hero.y
  }
  async loadCloseMapChunks() {
    const startY = c.ofMapChunk(User().data.hero.y) - 1
    const startX = c.ofMapChunk(User().data.hero.x) - 1
    for (let y of l.range(startY, startY + 3)) {
      for (let x of l.range(startX, startX + 3)) {
        await this.loadMapChunk(l.toString(y) + l.toString(x))
      }
    }
  }
  private async loadMapChunk(index: string) {
    if (l.keys(this.sprites.mapChunks).includes(index)) return

    let url = new URL(`/assets/maps/${index}.webp`, import.meta.url).href
    if (url.includes("undefined"))
      url = new URL("/assets/miscellaneous/mapNotFound.webp", import.meta.url)
        .href
    let asset = await p.Assets.load(url)
    this.sprites.mapChunks[index] = new p.Sprite(asset)
    this.sprites.mapChunks[index].cullable = true
    this.map.addChild(this.sprites.mapChunks[index])
  }
  private addContainers(app: Application) {
    app.stage.addChild(this.map)
    app.stage.addChild(this.collision)

    app.stage.addChild(this.sortable)
    this.sortable.addChild(this.hero)
  }
  private async loadHero() {
    const url = new URL("/assets/hero/hero.json", import.meta.url).href
    let asset = await p.Assets.load(url)
    l.forOwn(asset.animations, (value, key) => {
      this.sprites.hero[key] = new p.AnimatedSprite(value)
      this.sprites.hero[key].anchor.x = 0.5
      this.sprites.hero[key].anchor.y = 0.5
      this.sprites.hero[key].animationSpeed = 1 / 8
      this.sprites.hero[key].play()
      this.sprites.hero[key].visible = false
      this.hero.x = 1920 / 2
      this.hero.y = 1080 / 2
      this.hero.addChild(this.sprites.hero[key])
    })
  }
  private drawCollisionGrid() {
    const height = 13
    const width = 21
    for (let y of l.range(height)) {
      let row: Graphics[] = []
      for (let x of l.range(width)) {
        let square = new p.Graphics()
        square.blendMode = p.BLEND_MODES.MULTIPLY
        square.beginFill(0xffffff, 0.6)
        square.drawRect(x * 100, y * 100, 100, 100)
        square.endFill()
        row.push(square)
        this.collision.addChild(square)
      }
      this.collisionGrid.push(row)
    }
    for (let y of l.range(height)) {
      for (let x of l.range(width)) {
        let square = new p.Graphics()
        square.blendMode = p.BLEND_MODES.MULTIPLY
        square.lineStyle(5, 0xe6e6e6)
        square.drawRect(x * 100, y * 100, 100, 100)
        this.collision.addChild(square)
      }
    }
    this.collision.pivot.x = this.collision.width / 2
    this.collision.pivot.y = this.collision.height / 2
    this.collision.visible = false
  }
  updateCollisionGrid() {
    this.collision.x = 1920 / 2 - c.inTile(User().data.hero.x) + 50
    this.collision.y = 1080 / 2 - c.inTile(User().data.hero.y) + 50
    const startX = c.ofTile(User().data.hero.x) - 10
    const startY = c.ofTile(User().data.hero.y) - 6
    this.collisionGrid.forEach((row, y) => {
      row.forEach((square, x) => {
        const i = (startY + y) * 1000 + startX + x
        if (info.collision[i] === 0) square.tint = 0xffffff
        else if (info.collision[i] === 1) square.tint = 0x95d5b2
        else if (info.collision[i] === 2) square.tint = 0xf94144
        else square.tint = 0x9d0208
      })
    })
  }
}
export const pixi = new Pixi()
