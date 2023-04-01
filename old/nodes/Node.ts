// import { Renderer } from "../Renderer.ts"
// import { Ticker } from "pixi.js"

// // This is the base class for all nodes in the game engine
// export class Node {
//   public name: string
//   public parent: Node | null
//   public children: Node[]
//   public position: { x: number; y: number } // relative to parent
//   public rotation: number // in radians
//   public scale: { x: number; y: number }
//   public visible: boolean

//   constructor(name: string) {
//     this.name = name
//     this.parent = null
//     this.children = []
//     this.position = { x: 0, y: 0 }
//     this.rotation = 0
//     this.scale = { x: 1, y: 1 }
//     this.visible = true

//     Ticker.shared.add((deltaTime) => {
//       this.process(deltaTime)
//     })
//   }

//   // Adds a child node to this node
//   public addChild(child: Node): void {
//     child.parent = this
//     this.children.push(child)
//   }

//   // Removes a child node from this node
//   public removeChild(child: Node): void {
//     const index = this.children.indexOf(child)
//     if (index !== -1) {
//       child.parent = null
//       this.children.splice(index, 1)
//     }
//   }

//   // Finds a child node by name
//   public findChild(name: string): Node | null {
//     for (const child of this.children) {
//       if (child.name === name) {
//         return child
//       }
//       const result = child.findChild(name)
//       if (result !== null) {
//         return result
//       }
//     }
//     return null
//   }

//   // Updates the node and its children
//   public update(deltaTime: number): void {
//     for (const child of this.children) {
//       child.update(deltaTime)
//     }
//   }

//   // Renders the node and its children using the renderer
//   public render(renderer: Renderer): void {
//     if (this.visible) {
//       renderer.save()
//       renderer.translate(this.position.x, this.position.y)
//       renderer.rotate(this.rotation)
//       renderer.scale(this.scale.x, this.scale.y)
//       this.draw(renderer)
//       for (const child of this.children) {
//         child.render(renderer)
//       }
//       renderer.restore()
//     }
//   }

//   // Draws the node using the renderer
//   // This method should be overridden by subclasses
//   public draw(renderer: Renderer): void {}

//   // Processes the node using the delta time
//   // This method should be overridden by subclasses that need to do something every frame
//   public process(deltaTime: number): void {}
// }
