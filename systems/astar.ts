import { l } from "vitest/dist/index-40ebba2b"

export default class {
  openList: any = []
  closedList: any = []
  clean = true

  grid = []

  init() {
    this.grid = SYSTEMS.collision.collisionArray
  }

  process() {
    let executes: any = []
    ENTITIES.forEach((entity, id) => {
      executes.push(() => {
        if (
          _.round(GPIXI.elapsedMS / 100) % _.random(1, 5) !== 0 &&
          id !== SYSTEM_DATA.world.heroId
        ) {
          return
        }
        if (entity.move) {
          // if (!entity.move.path || entity.move.path.length == 0) {
          const startTile = {
            x: LIB.coordinateToTile(entity.position.x),
            y: LIB.coordinateToTile(entity.position.y),
          }
          const endTile = {
            x: LIB.coordinateToTile(entity.move.finaldestination.x),
            y: LIB.coordinateToTile(entity.move.finaldestination.y),
          }
          entity.move.path = this.findPath(startTile, endTile, entity)

          entity.move.destination = _.cloneDeep(entity.position)
          if (entity.move.path.length > 1 && entity.move.destination) {
            entity.move.destination.x =
              LIB.tileToCoordinate(entity.move.path[1].x) + 10
            entity.move.destination.y =
              LIB.tileToCoordinate(entity.move.path[1].y) + 10
          }
        }
      })
    })
    executes.forEach((func) => func())
  }

  getNeighbors(node, collision) {
    const neighbors: any = []

    // Add neighbor above
    if (
      this.grid[node.y - 1][node.x] === 0 ||
      this.grid[node.y - 1][node.x] === 1 ||
      collision === "collision"
    ) {
      neighbors.push({ x: node.x, y: node.y - 1 })
    }

    // Add neighbor below
    if (
      this.grid[node.y + 1][node.x] === 0 ||
      this.grid[node.y + 1][node.x] === 1 ||
      collision === "collision"
    ) {
      neighbors.push({ x: node.x, y: node.y + 1 })
    }

    // Add neighbor left
    if (
      this.grid[node.y][node.x - 1] === 0 ||
      this.grid[node.y][node.x - 1] === 1 ||
      collision === "collision"
    ) {
      neighbors.push({ x: node.x - 1, y: node.y })
    }

    // Add neighbor right
    if (
      this.grid[node.y][node.x + 1] === 0 ||
      this.grid[node.y][node.x + 1] === 1 ||
      collision === "collision"
    ) {
      neighbors.push({ x: node.x + 1, y: node.y })
    }

    // Top left
    if (
      this.grid[node.y - 1][node.x - 1] === 0 ||
      this.grid[node.y - 1][node.x - 1] === 1 ||
      collision === "collision"
    ) {
      neighbors.push({ x: node.x - 1, y: node.y - 1 })
    }

    // Top right
    if (
      this.grid[node.y - 1][node.x + 1] === 0 ||
      this.grid[node.y - 1][node.x + 1] === 1 ||
      collision === "collision"
    ) {
      neighbors.push({ x: node.x + 1, y: node.y - 1 })
    }

    // Bottom left
    if (
      this.grid[node.y + 1][node.x - 1] === 0 ||
      this.grid[node.y + 1][node.x - 1] === 1 ||
      collision === "collision"
    ) {
      neighbors.push({ x: node.x - 1, y: node.y + 1 })
    }

    // Bottom right
    if (
      this.grid[node.y + 1][node.x + 1] === 0 ||
      this.grid[node.y + 1][node.x + 1] === 1 ||
      collision === "collision"
    ) {
      neighbors.push({ x: node.x + 1, y: node.y + 1 })
    }

    return neighbors
  }

  findPath(startPos, endPos, entity, collision = "no") {
    this.clean = true
    this.openList = []
    this.closedList = []
    startPos.g = 0

    this.openList.push(startPos)

    let maxSteps = 600

    while (this.openList.length > 0) {
      maxSteps--

      let current = this.getLowestF(this.openList)

      if (maxSteps < 0) {
        console.warn("Reached max steps!")
        if (this.clean) return [undefined, endPos]
        //
        // 📜 clean this - find closest
        if (!LIB.isWalkable(endPos.x, endPos.y)) {
          // if (tile) {
          //   entity.move.finaldestination.x = LIB.tileToCoordinate(tile.x)
          //   entity.move.finaldestination.y = LIB.tileToCoordinate(tile.y)
          // }
        }
        return this.reconstructPath(current)
      }

      this.openList = this.openList.filter((p) => p !== current)
      this.closedList.push(current)

      if (current.x === endPos.x && current.y === endPos.y) {
        if (this.clean && collision === "no") return [undefined, endPos]
        return this.reconstructPath(current)
      }

      let neighbors = this.getNeighbors(current, collision)
      if (neighbors.length < 8) this.clean = false

      for (let neighbor of neighbors) {
        if (
          this.closedList.find((p) => p.x === neighbor.x && p.y === neighbor.y)
        )
          continue

        let g = current.g + 1
        let h = this.heuristic(neighbor, endPos)
        let f = g + h

        let inOpen = this.openList.find(
          (p) => p.x === neighbor.x && p.y === neighbor.y
        )
        if (inOpen && inOpen.f < f) continue

        neighbor.g = g
        neighbor.f = f
        neighbor.parent = current

        if (!inOpen) this.openList.push(neighbor)
      }
    }

    return []
  }

  // Compute heuristic cost between current node and end node

  heuristic(current, end) {
    // Ensure positions are valid
    if (!current || !end) {
      return 0
    }
    // Simple Manhattan distance
    return Math.abs(current.x - end.x) + Math.abs(current.y - end.y)
  }

  // Get node in open list with lowest f cost
  getLowestF(openList) {
    return openList.reduce((lowest, node) => {
      if (node.f < lowest.f) {
        lowest = node
      }
      return lowest
    }, openList[0])
  }

  // Reconstruct path after reaching end node
  reconstructPath(endNode) {
    let path: number[] = []
    let current = endNode
    while (current) {
      path.unshift(current) // add to front
      current = current.parent
    }
    return path
  }
}
