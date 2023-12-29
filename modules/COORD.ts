declare global {
    type Coord = { x: number; y: number }
    type Tile = { x: number; y: number }
}
class Vector {
    x: number
    y: number
    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }
    get distance() {
        return Math.sqrt(this.x ** 2 + this.y ** 2)
    }
    get angle() {
        return Math.atan2(this.y, this.x)
    }
}
class Coordinates {
    vector(x: number, y: number) {
        return new Vector(x, y)
    }
    vectorFromPoints(
        p1: { x: number; y: number },
        p2: { x: number; y: number }
    ) {
        return new Vector(p2.x - p1.x, p2.y - p1.y)
    }
    vectorFromAngle(angle: number, distance: number) {
        return new Vector(
            distance * Math.cos(angle),
            distance * Math.sin(angle)
        )
    }
    angle(p1: { x: number; y: number }, p2: { x: number; y: number }) {
        return Math.atan2(p2.y - p1.y, p2.x - p1.x)
    }
    distance(p1: { x: number; y: number }, p2: { x: number; y: number }) {
        return Math.sqrt((p2.y - p1.y) ** 2 + (p2.x - p1.x) ** 2)
    }
    distance_to_hero(p1: { x: number; y: number }) {
        const p2 = HERO.ent.POS || p1
        return this.distance(p1, p2)
    }
    speedPerTick(ent) {
        return ent.MOVE.speed * 10 * LOOP.delta_sec
    }
    conterOfScreen() {
        return this.vector(
            CONFIG.viewport.width / 2,
            CONFIG.viewport.height / 2
        )
    }
    mouseOfScreen() {
        if (!GLOBAL.firstMouseMove) return this.vector(-30, -30)

        return COORD.vector(
            INPUT.mouse.x / GLOBAL.gameWindowScale,
            INPUT.mouse.y / GLOBAL.gameWindowScale
        )
    }
    get mouse() {
        const mouse_pos = COORD.mouseOfScreen()
        return this.vector(
            (mouse_pos.x += HERO.ent.POS.x - CONFIG.viewport.width / 2),
            (mouse_pos.y += HERO.ent.POS.y - CONFIG.viewport.height / 2)
        )
    }
    coordinateToScreen(x: number, y: number) {
        if (!HERO.ent.POS) return { x: 0, y: 0 }
        return {
            x: x - HERO.ent.POS.x + CONFIG.viewport.width / 2,
            y: y - HERO.ent.POS.y + CONFIG.viewport.height / 2,
        }
    }
    coordinateToChunk(coordinate: number) {
        return _.floor(coordinate / 1000)
    }
    chunk_from_coordinates(coord: Coord) {
        const chunkX = this.coordinateToChunk(coord.x)
        const chunkY = this.coordinateToChunk(coord.y)
        return `${chunkY.toString().padStart(2, "0")}${chunkX
            .toString()
            .padStart(2, "0")}`
    }
    chunkFromCoordinates(x: number, y: number) {
        const chunkX = this.coordinateToChunk(x)
        const chunkY = this.coordinateToChunk(y)
        return `${chunkY.toString().padStart(2, "0")}${chunkX
            .toString()
            .padStart(2, "0")}`
    }
    chunkToCoordinateX(chunk: string) {
        return (_.toNumber(chunk) % 100) * 1000
    }
    chunkToCoordinateY(chunk: string) {
        return _.floor(_.toNumber(chunk) / 100) * 1000
    }
    to_tile(coord: Coord): Tile {
        return { x: _.floor(coord.x / 20), y: _.floor(coord.y / 20) }
    }
    coordinateOffsetInTile(coordinate: number) {
        return coordinate % 20
    }
    from_tile(tile: Tile): Coord {
        return { x: tile.x * 20, y: tile.y * 20 }
    }
    isGreenTile(tile: Tile) {
        return COLLISION.get_element([tile.y, tile.x]) === 1
    }
    on_same_tile(coord_1: Coord, coord_2: Coord) {
        return _.isEqual(COORD.to_tile(coord_1), COORD.to_tile(coord_2))
    }
    compare(coord_1: Coord, coord_2: Coord) {
        return coord_1.x === coord_2.x && coord_1.y === coord_2.y
    }
}
export const COORD = new Coordinates()
