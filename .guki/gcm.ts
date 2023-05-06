import { Graphics } from "pixi.js"
import json from "@/assets/miscellaneous/collisionArray.json"

class CollisionManager {
  public collisionArray: number[] = json
  private collisionGrid: Graphics[][] = []

  public drawCollisionGrid() {
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
        gpixi.collision.addChild(square)
      }
      this.collisionGrid.push(row)
    }
    for (let y of _.range(height)) {
      for (let x of _.range(width)) {
        let square = new PIXI.Graphics()
        square.blendMode = PIXI.BLEND_MODES.MULTIPLY
        square.lineStyle(5, 0xe6e6e6)
        square.drawRect(x * 100, y * 100, 100, 100)
        gpixi.collision.addChild(square)
      }
    }
    gpixi.collision.pivot.x = gpixi.collision.width / 2
    gpixi.collision.pivot.y = gpixi.collision.height / 2
    gpixi.collision.visible = false
  }

  public updateCollisionGrid() {
    if (!gef.heroInstance) return
    if (!gef.heroInstance.x || !gef.heroInstance.y) return

    // center point of collision grid minus hero offset
    gpixi.collision.x =
      1920 / 2 - glib.coordinateOffsetInTile(gef.heroInstance.x) + 50
    gpixi.collision.y =
      1080 / 2 - glib.coordinateOffsetInTile(gef.heroInstance.y) + 50

    const startX = glib.coordinateToTile(gef.heroInstance.x) - 10
    const startY = glib.coordinateToTile(gef.heroInstance.y) - 6
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
    if (!gef.heroInstance) return

    let i = glib.tileIndexFromEntity(gef.heroInstance)
    if (!i) return

    if (gic.gamepad.pressed.includes("Y")) this.collisionArray[i] = 0
    else if (gic.gamepad.pressed.includes("X")) this.collisionArray[i] = 1
    else if (gic.gamepad.pressed.includes("B")) this.collisionArray[i] = 2
    else if (gic.gamepad.pressed.includes("A")) this.collisionArray[i] = 3
    else if (gic.gamepad.pressed.includes("RB"))
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

  public init() {
    this.drawCollisionGrid()

    gpixi.app?.ticker.add(() => {
      if (gim.states.editingCollision) {
        gpixi.collision.visible = true
        this.updateCollisionArray()
        this.updateCollisionGrid()
      } else {
        gpixi.collision.visible = false
      }
    })
  }
}

export const gcm = new CollisionManager()
