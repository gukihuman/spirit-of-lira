import { Sprite } from "pixi.js"

class MapManager {
  public loadedGroundChunks: Map<string, Sprite> = new Map()

  private async loadCloseMapChunks() {
    if (!gef.instanciatedHero) return

    const startY = glib.coordinateToMapChunk(gef.instanciatedHero.y) - 1
    const startX = glib.coordinateToMapChunk(gef.instanciatedHero.x) - 1

    for (let y of _.range(startY, startY + 3)) {
      for (let x of _.range(startX, startX + 3)) {
        await gpm.loadGroundChunk(_.toString(y) + _.toString(x))
      }
    }
  }
  public async initialize() {
    await this.loadCloseMapChunks()

    gpm.app?.ticker.add(() => {
      this.loadCloseMapChunks()

      this.loadedGroundChunks.forEach((sprite, index) => {
        if (gef.instanciatedHero) {
          sprite.x =
            (_.toNumber(index) % 100) * 1000 + 1920 / 2 - gef.instanciatedHero.x
          sprite.y =
            _.floor(_.toNumber(index) / 100) * 1000 +
            1080 / 2 -
            gef.instanciatedHero.y
        }
      })
    })
  }
}
export const gmm = new MapManager()
