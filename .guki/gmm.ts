import { Sprite } from "pixi.js"

class MapManager {
  //
  public loadedMapChunks: Map<string, Sprite> = new Map()

  public greenForestCnunks: string[] = this.setLocationChunks(50, 54)

  private setLocationChunks(start: number, end: number) {
    const chunks: string[] = []
    for (let y = start; y <= end; y++) {
      for (let x = start; x <= end; x++) {
        chunks.push(`${y}${x}`)
      }
    }
    return chunks
  }

  private async loadMapChunk(index: string) {
    if (gmm.loadedMapChunks.get(index)) return

    // immideately add index to the map to prevent duplicates
    // before Sprite is actually loaded using await later
    gmm.loadedMapChunks.set(index, new PIXI.Sprite())

    let url = new URL(`/assets/map-chunks/${index}.webp`, import.meta.url).href
    if (url.includes("undefined")) {
      url = new URL("/assets/miscellaneous/map-not-found.webp", import.meta.url)
        .href
    }
    const webp = await PIXI.Assets.load(url)
    const sprite = new PIXI.Sprite(webp)
    sprite.cullable = true
    gpixi.ground.addChild(sprite)
    gmm.loadedMapChunks.set(index, sprite)
  }

  private async loadCloseMapChunks() {
    if (!gef.heroInstance) return
    if (!gef.heroInstance.x || !gef.heroInstance.y) return

    const startY = glib.coordinateToMapChunk(gef.heroInstance.y) - 1
    const startX = glib.coordinateToMapChunk(gef.heroInstance.x) - 1

    for (let y of _.range(startY, startY + 3)) {
      for (let x of _.range(startX, startX + 3)) {
        await this.loadMapChunk(_.toString(y) + _.toString(x))
      }
    }
  }

  public async init() {
    //
    // need to be called on init so map is loaded fully on initial loading
    await this.loadCloseMapChunks()

    gpixi.tickerAdd(() => {
      this.loadCloseMapChunks()

      // update coordinates
      this.loadedMapChunks.forEach((sprite, mapChunk) => {
        if (!gef.heroInstance) return
        if (!gef.heroInstance.x || !gef.heroInstance.y) return
        sprite.x =
          glib.mapChunkToCoordinateX(mapChunk) + 960 - gef.heroInstance.x
        sprite.y =
          glib.mapChunkToCoordinateY(mapChunk) + 540 - gef.heroInstance.y
      }, "gmm")
    })
  }
}
export const gmm = new MapManager()
