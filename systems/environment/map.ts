export default class {
  chunkSprites: Map<string, Sprite> = new Map()
  closeChunks: string[] = []

  greenForestChunks: string[] = this.setLocationChunks(0, 4)

  /** @returns square of chunks, for example for 50 and 51 ["5050", "5051", "5150", "5151"]
   */
  private setLocationChunks(start: number, end: number) {
    const chunks: string[] = []
    for (let y = start; y <= end; y++) {
      for (let x = start; x <= end; x++) {
        let stringX = `${x}`
        if (stringX.length === 1) stringX = `0${stringX}`
        let stringY = `${y}`
        if (stringY.length === 1) stringY = `0${stringY}`
        chunks.push(`${stringY}${stringX}`)
      }
    }
    return chunks
  }

  async init() {
    await this.loadCloseChunks()
  }

  process() {
    this.loadCloseChunks()

    const heroPosition = SYSTEM_DATA.world.hero.position
    if (!heroPosition) return

    // update coordinates
    this.chunkSprites.forEach((sprite, chunk) => {
      if (!heroPosition.x || !heroPosition.y) return
      sprite.x = LIB.chunkToCoordinateX(chunk) + 960 - heroPosition.x
      sprite.y = LIB.chunkToCoordinateY(chunk) + 540 - heroPosition.y
    })
  }

  private async loadCloseChunks() {
    if (!SYSTEM_DATA.world.heroId) return
    const heroEntity = ENTITIES.get(SYSTEM_DATA.world.heroId)
    if (!heroEntity) return
    const heroPosition = SYSTEM_DATA.world.hero.position

    const startY = LIB.coordinateToChunk(heroPosition.y) - 1
    const startX = LIB.coordinateToChunk(heroPosition.x) - 1

    this.closeChunks = []
    const sprites: Promise<void>[] = []
    for (let y of _.range(startY, startY + 3)) {
      for (let x of _.range(startX, startX + 3)) {
        let stringX = `${x}`
        if (stringX.length === 1) stringX = `0${stringX}`
        let stringY = `${y}`
        if (stringY.length === 1) stringY = `0${stringY}`
        const chunk = `${stringY}${stringX}`
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

    let webp = IMPORTS.webps.get(index)

    if (!webp) webp = IMPORTS.webps.get("map-not-found")
    if (!webp) return

    const texture = await PIXI.Assets.load(webp)

    const sprite = new PIXI.Sprite(texture)
    sprite.cullable = true
    GPIXI.map.addChild(sprite)
    this.chunkSprites.set(index, sprite)
  }
}
