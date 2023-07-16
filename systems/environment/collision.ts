import json from "@/assets/miscellaneous/collisionArray.json"

export default class {
  collisionArray: number[][] = json
  private collisionGrid: Graphics[][] = []

  init() {
    if (SYSTEM_DATA.states.devMode) this.drawCollisionGrid()
  }

  process() {
    if (SYSTEM_DATA.states.collisionEdit) {
      GPIXI.collision.visible = true
      this.updateCollisionArray()
      this.updateCollisionGrid()
    } else {
      GPIXI.collision.visible = false
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
        GPIXI.collision.addChild(square)
      }
      this.collisionGrid.push(row)
    }
    for (let y of _.range(height)) {
      for (let x of _.range(width)) {
        let square = new PIXI.Graphics()
        square.blendMode = PIXI.BLEND_MODES.MULTIPLY
        square.lineStyle(4, 0xe6e6e6)
        square.drawRect(x * 20, y * 20, 20, 20)
        GPIXI.collision.addChild(square)
      }
    }
    GPIXI.collision.pivot.x = GPIXI.collision.width / 2
    GPIXI.collision.pivot.y = GPIXI.collision.height / 2
    GPIXI.collision.visible = false
  }

  updateCollisionGrid() {
    if (!SYSTEM_DATA.world.heroId) return
    const heroPosition = SYSTEM_DATA.world.hero.position

    // center point of collision grid minus hero offset
    // 50 is the half of the tile size of 100
    GPIXI.collision.x =
      CONFIG.viewport.width / 2 -
      LIB.coordinateOffsetInTile(heroPosition.x) +
      10
    GPIXI.collision.y =
      CONFIG.viewport.height / 2 -
      LIB.coordinateOffsetInTile(heroPosition.y) +
      10

    const startY = LIB.coordinateToTile(heroPosition.y) - 27
    const startX = LIB.coordinateToTile(heroPosition.x) - 48
    this.collisionGrid.forEach((row, y) => {
      row.forEach((square, x) => {
        let tileX = startX + x
        let tileY = startY + y
        if (this.collisionArray[tileY] === undefined) {
          square.tint = 0x8f0005
          return
        }
        if (this.collisionArray[tileY][tileX] === undefined) {
          square.tint = 0x8f0005
          return
        }

        if (this.collisionArray[tileY][tileX] === 0) square.tint = 0xffffff
        else if (this.collisionArray[tileY][tileX] === 1) square.tint = 0x95d5b2
        else if (this.collisionArray[tileY][tileX] === 2) square.tint = 0x7e7eff
        else square.tint = 0x8f0005 // when tile is 3 or undefined
      })
    })
  }

  private updateCollisionArray() {
    if (!SYSTEM_DATA.world.heroId) return
    const heroPosition = SYSTEM_DATA.world.hero.position

    let y = LIB.coordinateToTile(heroPosition.y)
    let x = LIB.coordinateToTile(heroPosition.x)

    if (INPUT.gamepad.pressed.includes("Y")) this.collisionArray[y][x] = 0
    else if (INPUT.gamepad.pressed.includes("X")) this.collisionArray[y][x] = 1
    else if (INPUT.gamepad.pressed.includes("B")) this.collisionArray[y][x] = 2
    else if (INPUT.gamepad.pressed.includes("A")) this.collisionArray[y][x] = 3
    else if (INPUT.gamepad.pressed.includes("LB")) {
      for (let brushY = y - 5; brushY < y + 5; brushY++) {
        for (let brushX = x - 5; brushX < x + 5; brushX++) {
          this.collisionArray[brushY][brushX] = 3
        }
      }
    } else if (INPUT.gamepad.pressed.includes("RB"))
      this.downloadCollisionArrayDebounced()
  }

  private downloadCollisionArrayDebounced = _.debounce(() => {
    const stringifiedArray = JSON.stringify(this.collisionArray)
    const blob = new Blob([stringifiedArray], { type: "application/json" })

    const url = URL.createObjectURL(blob)

    // Create a hidden link element
    const link = document.createElement("a")
    link.style.display = "none"
    link.href = url
    link.download = "collisionArray.json"

    // Add the link element to the document
    document.body.appendChild(link)

    // Trigger the download
    link.click()

    // Clean up the URL and link element
    window.URL.revokeObjectURL(url)
    document.body.removeChild(link)
  }, 30)
}
