const precision = 2
let performance_time_stamp: number
let hero_prevent_time_token = ""
class Astar {
    openList: any = []
    closedList: any = []
    clean = true
    maxSteps = 2000 / precision
    maxTime = 7 // ms for hero and for mobs separately
    process() {
        performance_time_stamp = performance.now()
        // hero should be prioritized, though it should be first in entities as it is, making this explicitly here not gonna hurt in case
        MUSEUM.process_entity("HERO", (ent, id) => {
            this.process_path(ent, id)
        })
        performance_time_stamp = performance.now()
        MUSEUM.process_entity(["MOVE", "NONHERO"], (ent, id) => {
            this.process_path(ent, id)
        })
    }
    process_path(ent, id) {
        if (!ent.MOVE.final_des) return
        if (_.isEqual(ent.POS, ent.MOVE.final_des)) return
        if (ent.NONHERO && Math.random() > 0.3) return
        const start: Tile = COORD.to_tile(ent.POS)
        const end: Tile = COORD.to_tile(ent.MOVE.final_des)
        if (ent.HERO) {
            if (
                !COLLISION.is_tile_clear(end) &&
                GLOBAL.lastActiveDevice === "gamepad" &&
                GLOBAL.collision
            ) {
                return
            }
        }
        const possible_path = this.findPath(start, end, ent)
        if (!possible_path) {
            if (ent.NONHERO) DESTINATION.set_random_des(ent, id)
            if (ent.HERO) {
                // HERO.reset_final_des()
                HERO.ent.MOVE.global_prevent = true
                if (hero_prevent_time_token)
                    TIME.cancel(hero_prevent_time_token)
                hero_prevent_time_token = TIME.after_iterations(5, () => {
                    HERO.ent.MOVE.global_prevent = false
                })
            }
            ent.MOVE.path = undefined
            return
        } else ent.MOVE.path = possible_path
        if (ent.MOVE.path.length > 2) {
            ent.MOVE.des = COORD.from_tile(ent.MOVE.path[0])
            ent.MOVE.des.x += 10
            ent.MOVE.des.y += 10
        } else {
            ent.MOVE.des.x = ent.MOVE.final_des.x
            ent.MOVE.des.y = ent.MOVE.final_des.y
            ent.MOVE.path = []
        }
    }
    addNeighbor(y, x, ent) {
        const collision = GLOBAL.collision
        if (
            COLLISION.get_element([y, x]) === 0 ||
            COLLISION.get_element([y, x]) === 1 ||
            !collision
        ) {
            if (COLLISION.get_mob_element([y, x]) !== 2 || ent.HERO) {
                return true
            }
        }
        return false
    }
    getAllNeighbors(tile, ent, p?: number) {
        const cardinalNeighbors = this.getCardinalNeighbors(tile, ent, p)
        const diagonalNeighbors = this.getDiagonalNeighbors(tile, ent, p)
        return diagonalNeighbors.concat(cardinalNeighbors)
    }
    getCardinalNeighbors(tile, ent, p?: number) {
        let precision = 1
        if (!p) precision = ent.HERO ? 2 : 1
        if (p) precision = p
        const neighbors: any = []

        // Add neighbor left
        if (this.addNeighbor(tile.y, tile.x - precision, ent)) {
            neighbors.push({ x: tile.x - precision, y: tile.y })
        }
        // Add neighbor right
        if (this.addNeighbor(tile.y, tile.x + precision, ent)) {
            neighbors.push({ x: tile.x + precision, y: tile.y })
        }
        // Add neighbor above
        if (this.addNeighbor(tile.y - precision, tile.x, ent)) {
            neighbors.push({ x: tile.x, y: tile.y - precision })
        }
        // Add neighbor below
        if (this.addNeighbor(tile.y + precision, tile.x, ent)) {
            neighbors.push({ x: tile.x, y: tile.y + precision })
        }

        return neighbors
    }
    getDiagonalNeighbors(tile, ent, p?: number) {
        let precision = 1
        if (!p) precision = ent.HERO ? 2 : 1
        if (p) precision = p
        const neighbors: any = []

        if (this.addNeighbor(tile.y - precision, tile.x - precision, ent)) {
            neighbors.push({ x: tile.x - precision, y: tile.y - precision })
        }
        if (this.addNeighbor(tile.y - precision, tile.x + precision, ent)) {
            neighbors.push({ x: tile.x + precision, y: tile.y - precision })
        }
        if (this.addNeighbor(tile.y + precision, tile.x - precision, ent)) {
            neighbors.push({ x: tile.x - precision, y: tile.y + precision })
        }
        if (this.addNeighbor(tile.y + precision, tile.x + precision, ent)) {
            neighbors.push({ x: tile.x + precision, y: tile.y + precision })
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

    findPath(startPos, endPos, ent) {
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

            if (performance.now() - performance_time_stamp >= this.maxTime)
                return null
            let current = this.getLowestF(this.openList)

            if (maxSteps < 0) {
                if (this.clean) return [endPos]
                let path = this.reconstructPath(current, startPos, ent)
                return this.refinePath(path, ent)
            }

            this.openList = this.openList.filter((p) => p !== current)
            this.closedList.push(current)

            if (
                Math.abs(current.x - endPos.x) <= precision &&
                Math.abs(current.y - endPos.y) <= precision
            ) {
                if (this.clean) return [endPos]
                let path = this.reconstructPath(current, startPos, ent)
                return this.refinePath(path, ent)
            }

            let neighbors = this.getAllNeighbors(current, ent)
            if (neighbors.length < 8) this.clean = false

            neighbors.forEach((neighbor) => {
                if (
                    this.closedList.find(
                        (p) => p.x === neighbor.x && p.y === neighbor.y
                    )
                ) {
                    return
                }
                let secondNeighbors = this.getAllNeighbors(neighbor, ent)

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

    refinePath(path, ent) {
        //
        const indexes: number[] = []

        let firstGreenFound = false

        for (let i = 0; i < path.length; i++) {
            let tile = path[i]
            if (!tile) continue

            let neighbors = this.getAllNeighbors(tile, ent, 1)

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

    reconstructPath(endNode, startPos, ent) {
        let path: number[] = []
        let current = endNode

        let minG = Infinity
        let minH = Infinity
        let max = 300
        while (current && max > 0) {
            path.unshift(current) // add to front
            const neighbors = this.getAllNeighbors(current, ent)

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
