import { Container } from "pixi.js"

declare global {
  interface gEntity {
    [index: string]: any
    name: string
    sprite: string
    process: (delta: number) => void
  }
  interface gUniqueEntity extends gEntity {
    x: number
    y: number
  }
  interface gCommonEntity extends gEntity {
    mapChunks: string[]
  }
  interface gInstanciatedEntity extends gEntity {
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
  public gUniqueEntity(node: any): node is gUniqueEntity {
    return (node as gUniqueEntity).x !== undefined
  }
}

export const gtm = new TypeManager()
