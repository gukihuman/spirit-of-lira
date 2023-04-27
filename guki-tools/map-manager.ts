import { Sprite } from "pixi.js"

class MapManager {
  //
  public loadedGroundChunks: Map<string, Sprite> = new Map()

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

  private async loadGroundChunk(index: string) {
    if (gmm.loadedGroundChunks.get(index)) return

    // immideately add index to the map to prevent duplicates
    // before Sprite is actually loaded using await later
    gmm.loadedGroundChunks.set(index, new PIXI.Sprite())

    let url = new URL(`/assets/ground-chunks/${index}.webp`, import.meta.url)
      .href
    if (url.includes("undefined")) {
      url = new URL("/assets/miscellaneous/map-not-found.webp", import.meta.url)
        .href
    }
    const webp = await PIXI.Assets.load(url)
    const sprite = new PIXI.Sprite(webp)
    sprite.cullable = true
    gpm.ground.addChild(sprite)
    gmm.loadedGroundChunks.set(index, sprite)
  }

  private async loadCloseMapChunks() {
    if (!gef.heroInstance) return

    const startY = glib.coordinateToMapChunk(gef.heroInstance.y) - 1
    const startX = glib.coordinateToMapChunk(gef.heroInstance.x) - 1

    for (let y of _.range(startY, startY + 3)) {
      for (let x of _.range(startX, startX + 3)) {
        await this.loadGroundChunk(_.toString(y) + _.toString(x))
      }
    }
    // 📜 load air chunks
  }

  public async initialize() {
    //
    await this.loadCloseMapChunks()

    gpm.app?.ticker.add(() => {
      this.loadCloseMapChunks()

      this.loadedGroundChunks.forEach((sprite, index) => {
        if (gef.heroInstance) {
          sprite.x =
            (_.toNumber(index) % 100) * 1000 + 1920 / 2 - gef.heroInstance.x
          sprite.y =
            _.floor(_.toNumber(index) / 100) * 1000 +
            1080 / 2 -
            gef.heroInstance.y
        }
      })
    })
  }
}
export const gmm = new MapManager()
