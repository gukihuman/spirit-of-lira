import { Application } from "pixi.js" // for type

interface Graphics {
  collisionEdit: number[]
}
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
  map = new p.Container()
  collisionEdit = new p.Container()
  sortable = new p.Container()
  hero = new p.Container()
  graphics: Graphics = {
    collisionEdit: [],
  }
  sprites: Sprites = {
    hero: {},
    mapChunks: {},
  }
  private async addContainers(app: Application) {
    app.stage.addChild(this.map)
    app.stage.addChild(this.collisionEdit)
    app.stage.addChild(this.sortable)
    this.sortable.addChild(this.hero)
  }
  private async loadHero() {
    const url = new URL("/assets/hero/hero.json", import.meta.url).href
    let asset = await p.Assets.load(url)
    l.forOwn(asset.animations, (value, key) => {
      this.sprites.hero[key] = new p.AnimatedSprite(value)
      this.sprites.hero[key].anchor.x = 0.5
      this.sprites.hero[key].anchor.y = 0.7
      this.sprites.hero[key].animationSpeed = 1 / 8
      this.sprites.hero[key].play()
      this.sprites.hero[key].visible = false
      this.hero.x = 1920 / 2
      this.hero.y = 1080 / 2
      this.hero.addChild(this.sprites.hero[key])
    })
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
  async loadCloseMapChunks() {
    const startY = mapFromCo(User().data.hero.y) - 1
    const startX = mapFromCo(User().data.hero.x) - 1
    for (let y of l.range(startY, startY + 3)) {
      for (let x of l.range(startX, startX + 3)) {
        await this.loadMapChunk(l.toString(y) + l.toString(x))
      }
    }
  }
  moveMap(index: string) {
    if (!l.keys(this.sprites.mapChunks).includes(index)) return

    this.sprites.mapChunks[index].x =
      (l.toNumber(index) % 100) * 1000 + 1920 / 2 - User().data.hero.x
    this.sprites.mapChunks[index].y =
      l.floor(l.toNumber(index) / 100) * 1000 + 1080 / 2 - User().data.hero.y
  }
  async initialize() {
    this.app = new p.Application({ width: 1920, height: 1080 })
    Refs().viewport.appendChild(this.app.view)
    this.addContainers(this.app)
    await this.loadHero()
    await this.loadCloseMapChunks()
    this.app.ticker.add(() => ticker())
  }
}

export const pixi = new Pixi()
