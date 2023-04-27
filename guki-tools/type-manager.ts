import { Container } from "pixi.js"

declare global {
  //
  interface gEntityModel {
    [index: string]: any
    name: string
    sprite: string
    size: number
    process: () => void
  }

  interface gUniqueEntityModel extends gEntityModel {
    x: number
    y: number
  }

  interface gCommonEntityModel extends gEntityModel {
    mapChunks: string[]
  }

  interface gEntityInstance extends gEntityModel {
    id: number
    x: number
    y: number
    state: string
  }

  interface gContainer extends Container {
    id: number
  }
}

class TypeManager {
  //
  // type guard
  public gUniqueEntity(node: any): node is gUniqueEntityModel {
    return (
      (node as gUniqueEntityModel).x !== undefined &&
      (node as gUniqueEntityModel).y !== undefined
    )
  }
}

export const gtm = new TypeManager()
