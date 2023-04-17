import { Application } from "pixi.js"

class pixiManager {
  private app: Application | undefined = undefined

  async initialize(viewport) {
    this.app = new PIXI.Application({ width: 1920, height: 1080 })
    viewport.appendChild(this.app.view)
  }
}
export const gpm = new pixiManager()
