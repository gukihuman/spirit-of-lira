import { Container } from "pixi.js"

declare global {
  interface gUnique {
    name: string
    sprite: string
    x: number
    y: number
    process: () => void
  }
  interface gEnemy {
    name: string
    sprite: string
    mapChunks: string[]
    process: () => void
  }
  interface gEntity {
    id: number
    name: string
    sprite: string
    x: number
    y: number
    state: string
    process: () => void
  }
  interface gContainer extends Container {
    id: number
  }
}

class TypeManager {
  public gUnique(node: any): node is gUnique {
    return (node as gUnique).x !== undefined
  }
}

export const gtm = new TypeManager()
