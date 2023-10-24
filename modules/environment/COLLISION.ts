const MAP_SIZE = { width: 40_000, height: 30_000 }
class Collision {
  array: number[][] = []
  private collisionGrid: Graphics[][] = []
  init() {
    this.array = ASSETS.jsons.collision
    if (GLOBAL.devMode) this.drawCollisionGrid()

    EVENTS.onSingle("toggleCollision", () => {
      GLOBAL.collision = !GLOBAL.collision
    })
    EVENTS.onSingle("toggleEditMode", () => {
      GLOBAL.editMode = !GLOBAL.editMode
    })
  }
  process() {
    if (GLOBAL.editMode) {
      WORLD.collision.visible = true
      this.updateCollisionArray()
      this.updateCollisionGrid()
    } else {
      WORLD.collision.visible = false
    }
  }
  drawCollisionGrid() {
    const height = 55
    const width = 97
    for (let y of _.range(height)) {
      let row: Graphics[] = []
      for (let x of _.range(width)) {
        let square = new PIXI.Graphics()
        square.blendMode = PIXI.BLEND_MODES.MULTIPLY
        square.beginFill(0xffffff, 0.75)
        square.drawRect(x * 20, y * 20, 20, 20)
        square.endFill()
        row.push(square)
        WORLD.collision.addChild(square)
      }
      this.collisionGrid.push(row)
    }
    for (let y of _.range(height)) {
      for (let x of _.range(width)) {
        let square = new PIXI.Graphics()
        square.blendMode = PIXI.BLEND_MODES.MULTIPLY
        square.lineStyle(4, 0xe6e6e6)
        square.drawRect(x * 20, y * 20, 20, 20)
        WORLD.collision.addChild(square)
      }
    }
    WORLD.collision.pivot.x = WORLD.collision.width / 2
    WORLD.collision.pivot.y = WORLD.collision.height / 2
    WORLD.collision.visible = false
  }

  updateCollisionGrid() {
    if (!WORLD.heroId) return
    const heroPosition = WORLD.hero.position

    // center point of collision grid minus hero offset
    // 50 is the half of the tile size of 100
    WORLD.collision.x =
      CONFIG.viewport.width / 2 -
      COORDS.coordinateOffsetInTile(heroPosition.x) +
      10
    WORLD.collision.y =
      CONFIG.viewport.height / 2 -
      COORDS.coordinateOffsetInTile(heroPosition.y) +
      10

    const startY = COORDS.coordinateToTile(heroPosition.y) - 27
    const startX = COORDS.coordinateToTile(heroPosition.x) - 48
    this.collisionGrid.forEach((row, y) => {
      row.forEach((square, x) => {
        let tileX = startX + x
        let tileY = startY + y
        if (this.array[tileY] === undefined) {
          square.tint = 0x8f0005
          return
        }
        if (this.array[tileY][tileX] === undefined) {
          square.tint = 0x8f0005
          return
        }

        if (this.array[tileY][tileX] === 0) square.tint = 0xffffff
        else if (this.array[tileY][tileX] === 1) square.tint = 0x95d5b2
        else if (this.array[tileY][tileX] === 2) square.tint = 0x7e7eff
        else square.tint = 0x8f0005 // when tile is 3 or undefined
      })
    })

    // draw path
    WORLD.hero.move.path.forEach((tile) => {
      if (!tile || !GLOBAL.collision) return
      let row = tile.x - startX
      let col = tile.y - startY
      if (!this.collisionGrid[col] || !this.collisionGrid[col][row]) return
      this.collisionGrid[col][row].tint = 0x414833
    })
  }

  private updateCollisionArray() {
    if (!WORLD.heroId) return
    const heroPosition = WORLD.hero.position

    let y = COORDS.coordinateToTile(heroPosition.y)
    let x = COORDS.coordinateToTile(heroPosition.x)
    if (y < 0 || x < 0) return

    if (INPUT.gamepad.pressed.includes("Y")) this.array[y][x] = 0
    else if (INPUT.gamepad.pressed.includes("X")) this.array[y][x] = 1
    else if (INPUT.gamepad.pressed.includes("B")) this.array[y][x] = 2
    else if (INPUT.gamepad.pressed.includes("A")) this.array[y][x] = 3
    else if (INPUT.gamepad.pressed.includes("LB")) {
      for (let brushY = y - 5; brushY < y + 5; brushY++) {
        for (let brushX = x - 5; brushX < x + 5; brushX++) {
          if (brushX < 0 || brushY < 0) continue
          this.array[brushY][brushX] = 3
        }
      }
    } else if (INPUT.gamepad.pressed.includes("RB")) {
      this.debouncedSendArray()
    }
  }
  private debouncedSendArray = _.debounce(
    () => SOCKET.sendArray(this.array),
    150
  )
}
export const COLLISION = new Collision()
