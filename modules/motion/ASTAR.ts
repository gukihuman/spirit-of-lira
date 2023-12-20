class Astar {
    openList: any = []
    closedList: any = []
    clean = true
    maxSteps = 2000
    maxTime = 25 // ms
    process() {
        MUSEUM.process_entity("MOVE", (entity, id) => {
            if (!entity.MOVE.final_des) return
            if (_.round(LOOP.elapsed / 100) % _.random(1, 5) !== 0) {
                return
            }
            const start: Tile = COORD.to_tile(entity.POS)
            const end: Tile = COORD.to_tile(entity.MOVE.final_des)
            if (
                !COLLISION.is_tile_clear(end) &&
                GLOBAL.lastActiveDevice === "gamepad" &&
                GLOBAL.collision
            ) {
                return
            }
            const possible_path = this.findPath(start, end, entity)
            if (!possible_path) return
            else entity.MOVE.path = possible_path

            entity.MOVE.des = _.cloneDeep(entity.POS)
            if (entity.MOVE.path.length <= 1) {
                entity.MOVE.des.x = entity.MOVE.final_des.x
                entity.MOVE.des.y = entity.MOVE.final_des.y
            } else {
                entity.MOVE.des = COORD.from_tile(entity.MOVE.path[0])
                entity.MOVE.des.x += 10
                entity.MOVE.des.y += 10
            }
        })
    }
    addNeighbor(y, x, entity) {
        const collision = GLOBAL.collision
        if (
            COLLISION.get_element([y, x]) === 0 ||
            COLLISION.get_element([y, x]) === 1 ||
            !collision
        ) {
            if (COLLISION.get_mob_element([y, x]) !== 2 || entity.HERO) {
                return true
            }
        }
        return false
    }
    getAllNeighbors(tile, entity) {
        const cardinalNeighbors = this.getCardinalNeighbors(tile, entity)
        const diagonalNeighbors = this.getDiagonalNeighbors(tile, entity)
        return diagonalNeighbors.concat(cardinalNeighbors)
    }
    getCardinalNeighbors(tile, entity) {
        const neighbors: any = []

        // Add neighbor left
        if (this.addNeighbor(tile.y, tile.x - 1, entity)) {
            neighbors.push({ x: tile.x - 1, y: tile.y })
        }
        // Add neighbor right
        if (this.addNeighbor(tile.y, tile.x + 1, entity)) {
            neighbors.push({ x: tile.x + 1, y: tile.y })
        }
        // Add neighbor above
        if (this.addNeighbor(tile.y - 1, tile.x, entity)) {
            neighbors.push({ x: tile.x, y: tile.y - 1 })
        }
        // Add neighbor below
        if (this.addNeighbor(tile.y + 1, tile.x, entity)) {
            neighbors.push({ x: tile.x, y: tile.y + 1 })
        }

        return neighbors
    }
    getDiagonalNeighbors(tile, entity) {
        const neighbors: any = []

        if (this.addNeighbor(tile.y - 1, tile.x - 1, entity)) {
            neighbors.push({ x: tile.x - 1, y: tile.y - 1 })
        }
        if (this.addNeighbor(tile.y - 1, tile.x + 1, entity)) {
            neighbors.push({ x: tile.x + 1, y: tile.y - 1 })
        }
        if (this.addNeighbor(tile.y + 1, tile.x - 1, entity)) {
            neighbors.push({ x: tile.x - 1, y: tile.y + 1 })
        }
        if (this.addNeighbor(tile.y + 1, tile.x + 1, entity)) {
            neighbors.push({ x: tile.x + 1, y: tile.y + 1 })
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
            COLLISION.get_element([endPos.y, endPos.x]) !== 0 &&
            COLLISION.get_element([endPos.y, endPos.x]) !== 1
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

    // Compute heuristic cost between current tile and end tile
    heuristic(current, end) {
        // Ensure POSs are valid
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

    // Get tile in open list with lowest f cost
    getLowestF(openList) {
        return openList.reduce((lowest, tile) => {
            if (tile.f < lowest.f) {
                lowest = tile
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
