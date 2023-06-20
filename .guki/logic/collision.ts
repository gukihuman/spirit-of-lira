import json from "@/assets/miscellaneous/collisionArray.json"

class CollisionManager {
  collisionArray: number[] = json
  private collisionGrid: Graphics[][] = []

  drawCollisionGrid() {
    const height = 13
    const width = 21
    for (let y of _.range(height)) {
      let row: Graphics[] = []
      for (let x of _.range(width)) {
        let square = new PIXI.Graphics()
        square.blendMode = PIXI.BLEND_MODES.MULTIPLY
        square.beginFill(0xffffff, 0.65)
        square.drawRect(x * 100, y * 100, 100, 100)
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
        square.lineStyle(5, 0xe6e6e6)
        square.drawRect(x * 100, y * 100, 100, 100)
        GPIXI.collision.addChild(square)
      }
    }
    GPIXI.collision.pivot.x = GPIXI.collision.width / 2
    GPIXI.collision.pivot.y = GPIXI.collision.height / 2
    GPIXI.collision.visible = false
  }

  updateCollisionGrid() {
    if (!GLOBAL.heroId) return
    const heroPosition = GLOBAL.hero.position

    // center point of collision grid minus hero offset
    // 50 is the half of the tile size of 100
    GPIXI.collision.x =
      1920 / 2 - LIB.coordinateOffsetInTile(heroPosition.x) + 50
    GPIXI.collision.y =
      1080 / 2 - LIB.coordinateOffsetInTile(heroPosition.y) + 50

    const startX = LIB.coordinateToTile(heroPosition.x) - 10
    const startY = LIB.coordinateToTile(heroPosition.y) - 6
    this.collisionGrid.forEach((row, y) => {
      row.forEach((square, x) => {
        const i = (startY + y) * 1000 + startX + x
        if (this.collisionArray[i] === 0) square.tint = 0xffffff
        else if (this.collisionArray[i] === 1) square.tint = 0x95d5b2
        else if (this.collisionArray[i] === 2) square.tint = 0x7e7eff
        else square.tint = 0x8f0005
      })
    })
  }

  private updateCollisionArray() {
    if (!GLOBAL.heroId) return
    const heroPosition = GLOBAL.hero.position

    let i = LIB.tileIndexFromCoordinates(heroPosition.x, heroPosition.y)

    if (INPUT.gamepad.pressed.includes("Y")) this.collisionArray[i] = 0
    else if (INPUT.gamepad.pressed.includes("X")) this.collisionArray[i] = 1
    else if (INPUT.gamepad.pressed.includes("B")) this.collisionArray[i] = 2
    else if (INPUT.gamepad.pressed.includes("A")) this.collisionArray[i] = 3
    else if (INPUT.gamepad.pressed.includes("RB"))
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

  init() {
    this.drawCollisionGrid()

    GPIXI.tickerAdd(() => {
      if (SYSTEM_DATA.states.collisionEdit) {
        GPIXI.collision.visible = true
        this.updateCollisionArray()
        this.updateCollisionGrid()
      } else {
        GPIXI.collision.visible = false
      }
    }, "COLLISION")
  }
}

export const COLLISION = new CollisionManager()
