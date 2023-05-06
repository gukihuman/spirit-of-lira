import { Container } from "pixi.js"

declare global {
  //
  interface gEntity {
    [index: string]: any
    id?: number
    name?: string
    sprite?: string
    size?: number
    x?: number
    y?: number
    state?: string
    mapChunks?: string[]
    process?: () => void
  }

  interface gContainer extends Container {
    id: number
  }
}
