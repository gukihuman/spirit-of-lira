class Astar {
    openList: any = []
    closedList: any = []
    clean = true
    maxSteps = 2000
    maxTime = 5
    process() {
        let executes: any = []
        WORLD.entities.forEach((entity, id) => {
            executes.push(() => {
                if (entity.MOVE) {
                    if (!entity.MOVE.final_destination) return
                    if (_.round(LOOP.elapsed / 100) % _.random(1, 5) !== 0) {
                        return
                    }
                    const startTile = {
                        x: COORD.coordinateToTile(entity.POSITION.x),
                        y: COORD.coordinateToTile(entity.POSITION.y),
                    }
                    let endTile = {
                        x: COORD.coordinateToTile(
                            entity.MOVE.final_destination.x
                        ),
                        y: COORD.coordinateToTile(
                            entity.MOVE.final_destination.y
                        ),
                    }

                    const mousePosition = COORD.mousePosition()
                    const mouseTileX = COORD.coordinateToTile(mousePosition.x)
                    const mouseTileY = COORD.coordinateToTile(mousePosition.y)

                    // mouseMove signal on non-walkable tile
                    if (
                        GLOBAL.lastActiveDevice !== "gamepad" &&
                        EVENTS.activeSingle.includes("mouseMove") &&
                        COLLISION.getArrayElement([mouseTileY, mouseTileX]) !==
                            0 &&
                        COLLISION.getArrayElement([mouseTileY, mouseTileX]) !==
                            1
                    ) {
                        entity.MOVE.setMousePointOnWalkableMS = LOOP.elapsed
                    }

                    if (
                        COLLISION.getArrayElement([endTile.y, endTile.x]) !==
                            0 &&
                        COLLISION.getArrayElement([endTile.y, endTile.x]) !==
                            1 &&
                        (LOOP.elapsed <
                            entity.MOVE.setMousePointOnWalkableMS + 100 ||
                            GLOBAL.lastActiveDevice === "gamepad")
                    ) {
                        if (GLOBAL.collision) {
                            return
                        }
                    }

                    const possiblePath = this.findPath(
                        startTile,
                        endTile,
                        entity
                    )
                    if (possiblePath) entity.MOVE.path = possiblePath
                    else return

                    entity.MOVE.destination = _.cloneDeep(entity.POSITION)
                    if (
                        entity.MOVE.path.length <= 1 &&
                        entity.MOVE.destination
                    ) {
                        entity.MOVE.destination.x =
                            entity.MOVE.final_destination.x
                        entity.MOVE.destination.y =
                            entity.MOVE.final_destination.y
                    } else if (
                        entity.MOVE.path.length > 0 &&
                        entity.MOVE.destination
                    ) {
                        entity.MOVE.destination.x =
                            COORD.tileToCoordinate(entity.MOVE.path[0].x) + 10
                        entity.MOVE.destination.y =
                            COORD.tileToCoordinate(entity.MOVE.path[0].y) + 10
                    }
                }
            })
        })
        executes.forEach((func) => func())
    }
    addNeighbor(y, x, entity) {
        const collision = GLOBAL.collision
        if (
            COLLISION.getArrayElement([y, x]) === 0 ||
            COLLISION.getArrayElement([y, x]) === 1 ||
            !collision
        ) {
            if (
                COLLISION.getArrayOfEntitiesElement([y, x]) !== 2 ||
                entity.HERO
            ) {
                return true
            }
        }
        return false
    }
    getAllNeighbors(node, entity) {
        const cardinalNeighbors = this.getCardinalNeighbors(node, entity)
        const diagonalNeighbors = this.getDiagonalNeighbors(node, entity)
        return diagonalNeighbors.concat(cardinalNeighbors)
    }
    getCardinalNeighbors(node, entity) {
        const neighbors: any = []

        // Add neighbor left
        if (this.addNeighbor(node.y, node.x - 1, entity)) {
            neighbors.push({ x: node.x - 1, y: node.y })
        }
        // Add neighbor right
        if (this.addNeighbor(node.y, node.x + 1, entity)) {
            neighbors.push({ x: node.x + 1, y: node.y })
        }
        // Add neighbor above
        if (this.addNeighbor(node.y - 1, node.x, entity)) {
            neighbors.push({ x: node.x, y: node.y - 1 })
        }
        // Add neighbor below
        if (this.addNeighbor(node.y + 1, node.x, entity)) {
            neighbors.push({ x: node.x, y: node.y + 1 })
        }

        return neighbors
    }
    getDiagonalNeighbors(node, entity) {
        const neighbors: any = []

        if (this.addNeighbor(node.y - 1, node.x - 1, entity)) {
            neighbors.push({ x: node.x - 1, y: node.y - 1 })
        }
        if (this.addNeighbor(node.y - 1, node.x + 1, entity)) {
            neighbors.push({ x: node.x + 1, y: node.y - 1 })
        }
        if (this.addNeighbor(node.y + 1, node.x - 1, entity)) {
            neighbors.push({ x: node.x - 1, y: node.y + 1 })
        }
        if (this.addNeighbor(node.y + 1, node.x + 1, entity)) {
            neighbors.push({ x: node.x + 1, y: node.y + 1 })
        }

        return neighbors
    }
    isCardinal(current, neighbor) {
        // Check if neighbor is strictly horizontal or vertical
        if (current.x === neighbor.x || current.y === neighbor.y) {
            return true
        }

        // If x and y both differ, it is diagonal
        if (current.x !== neighbor.x && current.y !== neighbor.y) {
            return false
        }

        return true
    }

    findPath(startPos, endPos, entity) {
        const t0 = performance.now()
        let walkable = true
        if (
            COLLISION.getArrayElement([endPos.y, endPos.x]) !== 0 &&
            COLLISION.getArrayElement([endPos.y, endPos.x]) !== 1
        ) {
            walkable = false
        }
        this.clean = true
        this.openList = []
        this.closedList = []
        startPos.g = 0

        this.openList.push(startPos)

        let maxSteps = this.maxSteps

        while (this.openList.length > 0) {
            maxSteps--

            if (performance.now() - t0 >= this.maxTime) return null
            let current = this.getLowestF(this.openList)

            if (maxSteps < 0) {
                if (this.clean) return [endPos]

                if (!walkable) {
                    this.setFinalDestinationToWalkable(endPos, entity)
                    entity.MOVE.setMousePointOnWalkableMS = LOOP.elapsed
                }
                let path = this.reconstructPath(current, startPos, entity)
                return this.refinePath(path, entity)
            }

            this.openList = this.openList.filter((p) => p !== current)
            this.closedList.push(current)

            if (current.x === endPos.x && current.y === endPos.y) {
                if (this.clean) return [endPos]
                let path = this.reconstructPath(current, startPos, entity)
                return this.refinePath(path, entity)
            }

            let neighbors = this.getAllNeighbors(current, entity)
            if (neighbors.length < 8) this.clean = false

            neighbors.forEach((neighbor) => {
                if (
                    this.closedList.find(
                        (p) => p.x === neighbor.x && p.y === neighbor.y
                    )
                ) {
                    return
                }
                let secondNeighbors = this.getAllNeighbors(neighbor, entity)

                let g = current.g
                if (
                    this.isCardinal(current, neighbor) ||
                    secondNeighbors.length === 8
                ) {
                    g = current.g + 1
                } else {
                    g = current.g + 2
                }
                if (COORD.isGreenTile(neighbor)) {
                    g = current.g + 0.1
                }
                let h = this.heuristic(neighbor, endPos)
                let f = g + h

                let inOpen = this.openList.find(
                    (p) => p.x === neighbor.x && p.y === neighbor.y
                )
                if (inOpen && inOpen.f < f) return

                neighbor.g = g
                neighbor.f = f
                neighbor.parent = current

                if (!inOpen) this.openList.push(neighbor)
            })
        }

        return []
    }

    refinePath(path, entity) {
        //
        const indexes: number[] = []

        let firstGreenFound = false

        for (let i = 0; i < path.length; i++) {
            let tile = path[i]
            if (!tile) continue

            let neighbors = this.getAllNeighbors(tile, entity)

            // all neighbors are walkable
            if (neighbors.length === 8) {
                indexes.push(i)
            }
        }

        // remove walkable only if before and after are walkable too
        // not green tiles
        indexes.forEach((i) => {
            //
            if (!COORD.isGreenTile(path[i])) {
                //
                if (indexes.includes(i - 1) && indexes.includes(i + 1)) {
                    //
                    path[i] = undefined
                }
            }
        })
        indexes.forEach((i) => {
            //
            // already removed
            if (!path[i]) return

            if (COORD.isGreenTile(path[i])) {
                //
                //
                if (!path[i + 1]) {
                    //
                    return
                }

                // remove green tile only if after are green too
                if (COORD.isGreenTile(path[i + 1]) && firstGreenFound) {
                    //
                    path[i] = undefined
                }

                firstGreenFound = true
            }
        })
        if (indexes.includes(0)) path[0] = undefined

        let newPath = path.filter((p) => p !== undefined)

        return newPath
    }

    setFinalDestinationToWalkable(endPos, entity) {
        let closestTile
        let minDist = Infinity

        let filteredList = this.closedList.filter((p, i) => i % 15 === 0)

        for (let tile of filteredList) {
            if (
                COLLISION.getArrayElement([tile.y, tile.x]) === 0 ||
                COLLISION.getArrayElement([tile.y, tile.x]) === 1
            ) {
                let dist = this.heuristic(tile, endPos)
                if (dist < minDist) {
                    closestTile = tile
                    minDist = dist
                }
            }
        }
        if (closestTile) {
            entity.MOVE.final_destination.x = COORD.tileToCoordinate(
                closestTile.x
            )
            entity.MOVE.final_destination.y = COORD.tileToCoordinate(
                closestTile.y
            )
        }
    }

    // Compute heuristic cost between current node and end node

    heuristic(current, end) {
        // Ensure positions are valid
        if (!current || !end) {
            return 0
        }
        let xDiff = Math.abs(current.x - end.x)
        let yDiff = Math.abs(current.y - end.y)

        if (xDiff > 0 && yDiff > 0) {
            // diagonal difference - add penalty
            return (xDiff + yDiff) * 1.1
        } else {
            return xDiff + yDiff
        }
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

    reconstructPath(endNode, startPos, entity) {
        let path: number[] = []
        let current = endNode

        let minG = Infinity
        let minH = Infinity
        let max = 300
        while (current && max > 0) {
            path.unshift(current) // add to front
            const neighbors = this.getAllNeighbors(current, entity)

            let closest
            _.reverse(neighbors)
            neighbors.forEach((neighbor) => {
                let found = false
                this.closedList.forEach((p) => {
                    if (found) return
                    if (p.x === neighbor.x && p.y === neighbor.y) {
                        let newH = this.heuristic(p, startPos)
                        if ((p.g <= minG && newH < minH) || p.g < minG) {
                            minG = p.g
                            minH = newH
                            closest = p
                            found = true
                        }
                    }
                })
            })
            current = closest
            max--
        }
        path.shift()
        return path
    }
}
export const ASTAR = new Astar()
