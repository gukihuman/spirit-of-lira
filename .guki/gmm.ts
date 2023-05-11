import { Sprite } from "pixi.js"

class MapManager {
  //
  // 📜 implement removing chunks that are lefted far away
  //
  public loadedChunks: Map<string, Sprite> = new Map()

  public greenForestCnunks: string[] = this.setLocationChunks(50, 54)

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

  public async init() {
    //
    // need to be called on init so map is loaded fully on initial loading
    await this.loadCloseChunks()

    gpixi.tickerAdd(() => {
      this.loadCloseChunks()

      const heroEntity = gworld.entities.get(gsd.states.heroId)
      if (!heroEntity) return
      const heroPosition = heroEntity.get("position")
      if (!heroPosition) return

      // update coordinates
      this.loadedChunks.forEach((sprite, mapChunk) => {
        if (!heroPosition.x || !heroPosition.y) return
        sprite.x = glib.mapChunkToCoordinateX(mapChunk) + 960 - heroPosition.x
        sprite.y = glib.mapChunkToCoordinateY(mapChunk) + 540 - heroPosition.y
      }, "gmm")
    })
  }

  private async loadChunk(index: string) {
    if (gmm.loadedChunks.get(index)) return

    // immideately add index to the map to prevent duplicates
    // before Sprite is actually loaded using await later
    gmm.loadedChunks.set(index, new PIXI.Sprite())

    let url = new URL(`/assets/map-chunks/${index}.webp`, import.meta.url).href
    if (url.includes("undefined")) {
      url = new URL("/assets/miscellaneous/map-not-found.webp", import.meta.url)
        .href
    }
    const webp = await PIXI.Assets.load(url)
    const sprite = new PIXI.Sprite(webp)
    sprite.cullable = true
    gpixi.map.addChild(sprite)
    gmm.loadedChunks.set(index, sprite)
  }

  private async loadCloseChunks() {
    if (!gsd.states.heroId) return
    const heroEntity = gworld.entities.get(gsd.states.heroId)
    if (!heroEntity) return
    const heroPosition = heroEntity.get("position")

    const startY = glib.coordinateToMapChunk(heroPosition.y) - 1
    const startX = glib.coordinateToMapChunk(heroPosition.x) - 1

    for (let y of _.range(startY, startY + 3)) {
      for (let x of _.range(startX, startX + 3)) {
        await this.loadChunk(_.toString(y) + _.toString(x))
      }
    }
  }
}
export const gmm = new MapManager()
