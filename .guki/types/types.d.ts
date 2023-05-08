// redeclare some types for global accessability, nuxt issue
import {
  Container,
  Application as tempApplication,
  AnimatedSprite as tempAnimatedSprite,
} from "pixi.js"

declare global {
  type Application = tempApplication
  type AnimatedSprite = tempAnimatedSprite

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
