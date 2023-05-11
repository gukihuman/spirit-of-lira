// redeclare some types for global accessability, nuxt issue
import {
  Graphics as tempGraphics,
  Container as tempContainer,
  Application as tempApplication,
  AnimatedSprite as tempAnimatedSprite,
} from "pixi.js"

declare global {
  type Graphics = tempGraphics
  type Container = tempContainer
  type Application = tempApplication
  type AnimatedSprite = tempAnimatedSprite

  interface gContainer extends Container {
    id: number
  }
  type gEntity = Map<string, any>
}
