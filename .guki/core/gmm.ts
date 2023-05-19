import { Sprite } from "pixi.js"

class MapManager {
  chunkSprites: Map<string, Sprite> = new Map()
  closeChunks: string[] = []

  greenForestChunks: string[] = this.setLocationChunks(50, 54)

  /** @returns square of chunks, for example for 50 and 51 ["5050", "5051", "5150", "5151"]
   */
  private setLocationChunks(start: number, end: number) {
    const chunks: string[] = []
    for (let y = start; y <= end; y++) {
      for (let x = start; x <= end; x++) {
        chunks.push(`${y}${x}`)
      }
    }
    return chunks
  }

  async init() {
    //
    // need to be called on init so map is loaded fully on initial loading
    await this.loadCloseChunks()

    gpixi.tickerAdd(() => {
      this.loadCloseChunks()

      const heroPosition = gg.hero.position
      if (!heroPosition) return

      // update coordinates
      this.chunkSprites.forEach((sprite, chunk) => {
        if (!heroPosition.x || !heroPosition.y) return
        sprite.x = glib.chunkToCoordinateX(chunk) + 960 - heroPosition.x
        sprite.y = glib.chunkToCoordinateY(chunk) + 540 - heroPosition.y
      }, "gmm")
    })
  }

  private async loadCloseChunks() {
    if (!gg.heroId) return
    const heroEntity = gworld.entities.get(gg.heroId)
    if (!heroEntity) return
    const heroPosition = gg.hero.position

    const startY = glib.coordinateToChunk(heroPosition.y) - 1
    const startX = glib.coordinateToChunk(heroPosition.x) - 1

    this.closeChunks = []
    const sprites: Promise<void>[] = []
    for (let y of _.range(startY, startY + 3)) {
      for (let x of _.range(startX, startX + 3)) {
        const chunk = `${y}${x}`
        this.closeChunks.push(chunk)
        sprites.push(this.loadChunkSprite(chunk))
      }
    }
    await Promise.all(sprites)
  }

  private async loadChunkSprite(index: string) {
    if (this.chunkSprites.get(index)) return

    // immideately add index to the map to prevent duplicates
    // before Sprite is actually loaded using await later
    this.chunkSprites.set(index, new PIXI.Sprite())

    const webp = gstorage.webps.get(index)
    if (!webp) gstorage.webps.get("map-not-found")
    if (!webp) return

    const texture = await PIXI.Assets.load(webp)

    const sprite = new PIXI.Sprite(texture)
    sprite.cullable = true
    gpixi.map.addChild(sprite)
    this.chunkSprites.set(index, sprite)
  }
}
export const gmm = new MapManager()
