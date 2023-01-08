import { Application, Container } from "pixi.js" // for types

class Viewport {
  app: Application | null
  map: Container
  collisionEdit: Container
  sortable: Container
  hero: Container
  graphics: { collisionEdit: number[] }
  sprites: {
    map: {}
    hero: {
      [index: string]: any
    }
  }
  constructor() {
    this.app = null
    this.map = new p.Container()
    this.collisionEdit = new p.Container()
    this.sortable = new p.Container()
    this.hero = new p.Container()
    this.graphics = {
      collisionEdit: [],
    }
    this.sprites = {
      hero: {},
      map: {},
    }
  }
  private async addContainers(app: Application) {
    app.stage.addChild(this.map)
    app.stage.addChild(this.collisionEdit)
    app.stage.addChild(this.sortable)
    this.sortable.addChild(this.hero)
  }
  private async loadHeroSprite() {
    const url = new URL(
      "/assets/creatures/hero/animations/hero.json",
      import.meta.url
    ).href
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
  async initialize() {
    this.app = new p.Application({ width: 1920, height: 1080 })
    Refs().viewport.appendChild(this.app.view)
    this.addContainers(this.app)
    await this.loadHeroSprite()

    this.sprites.hero["idle"].visible = true
  }
}

export const viewport = new Viewport()
