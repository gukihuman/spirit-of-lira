const map_size = { width: 40_000, height: 30_000 }
class Collision {
    array: math.Matrix = MATHJS.sparse()
    mob_array: math.Matrix = MATHJS.sparse()
    private collisionGrid: Graphics[][] = []
    init() {
        const arrayString = JSON.stringify(ASSETS.jsons.collision)
        this.array = JSON.parse(arrayString, MATHJS.reviver)
        if (GLOBAL.dev_env) this.draw_grid()
        EVENTS.onSingle("toggleCollision", () => {
            GLOBAL.collision = !GLOBAL.collision
        })
        EVENTS.onSingle("toggleEditMode", () => {
            GLOBAL.editMode = !GLOBAL.editMode
        })
    }
    process() {
        this.mob_array = MATHJS.sparse()
        MUSEUM.process_entity(["MOVE", "NONHERO"], (entity) => {
            let y = COORD.to_tile(entity.POSITION.y)
            let x = COORD.to_tile(entity.POSITION.x)
            this.mob_array.set([y, x], 2)
            this.mob_array.set([y, x - 1], 2)
            this.mob_array.set([y, x + 1], 2)
            this.mob_array.set([y + 1, x], 2)
            this.mob_array.set([y - 1, x], 2)
        })
        if (GLOBAL.editMode) {
            WORLD.collision.visible = true
            this.editCollisionArray()
            this.updateCollisionGrid()
        } else {
            WORLD.collision.visible = false
        }
    }
    draw_grid() {
        const height = 55
        const width = 97
        for (let y of _.range(height)) {
            let row: Graphics[] = []
            for (let x of _.range(width)) {
                let square = new PIXI.Graphics()
                square.blendMode = PIXI.BLEND_MODES.MULTIPLY
                square.beginFill(0xffffff, 0.75)
                square.drawRect(x * 20, y * 20, 20, 20)
                square.endFill()
                row.push(square)
                WORLD.collision.addChild(square)
            }
            this.collisionGrid.push(row)
        }
        for (let y of _.range(height)) {
            for (let x of _.range(width)) {
                let square = new PIXI.Graphics()
                square.blendMode = PIXI.BLEND_MODES.MULTIPLY
                square.lineStyle(4, 0xe6e6e6)
                square.drawRect(x * 20, y * 20, 20, 20)
                WORLD.collision.addChild(square)
            }
        }
        WORLD.collision.pivot.x = WORLD.collision.width / 2
        WORLD.collision.pivot.y = WORLD.collision.height / 2
        WORLD.collision.visible = false
    }

    updateCollisionGrid() {
        if (!HERO.entity) return
        const heroPosition = HERO.entity.POSITION

        // center point of collision grid minus hero offset
        // 50 is the half of the tile size of 100
        WORLD.collision.x =
            CONFIG.viewport.width / 2 -
            COORD.coordinateOffsetInTile(heroPosition.x) +
            10
        WORLD.collision.y =
            CONFIG.viewport.height / 2 -
            COORD.coordinateOffsetInTile(heroPosition.y) +
            10

        const startY = COORD.to_tile(heroPosition.y) - 27
        const startX = COORD.to_tile(heroPosition.x) - 48
        this.collisionGrid.forEach((row, y) => {
            row.forEach((square, x) => {
                let tileX = startX + x
                let tileY = startY + y
                if (this.array.get([tileY, tileX]) === undefined) {
                    square.tint = 0x8f0005
                    return
                }
                if (this.get_mob_element([tileY, tileX]) === 2) {
                    square.tint = 0x7e7eff
                    return
                }
                if (this.array.get([tileY, tileX]) === 0) square.tint = 0xffffff
                else if (this.array.get([tileY, tileX]) === 1)
                    square.tint = 0x95d5b2
                else if (this.array.get([tileY, tileX]) === 2)
                    square.tint = 0x7e7eff
                else square.tint = 0x8f0005 // when tile is 3 or undefined
            })
        })

        // draw paths
        MUSEUM.process_entity("MOVE", (entity) => {
            if (!entity.MOVE.path) return
            entity.MOVE.path.forEach((tile) => {
                if (!tile || !GLOBAL.collision) return
                let row = tile.x - startX
                let col = tile.y - startY
                if (!this.collisionGrid[col] || !this.collisionGrid[col][row])
                    return
                this.collisionGrid[col][row].tint = 0x414833
            })
        })
    }

    private editCollisionArray() {
        if (!HERO.entity) return
        const heroPosition = HERO.entity.POSITION

        let y = COORD.to_tile(heroPosition.y)
        let x = COORD.to_tile(heroPosition.x)
        if (y < 0 || x < 0) return

        if (INPUT.gamepad.pressed.includes("Y")) this.array.set([y, x], 0)
        else if (INPUT.gamepad.pressed.includes("X")) this.array.set([y, x], 1)
        else if (INPUT.gamepad.pressed.includes("B")) this.array.set([y, x], 2)
        else if (INPUT.gamepad.pressed.includes("A")) this.array.set([y, x], 3)
        else if (INPUT.gamepad.pressed.includes("LB")) {
            for (let brushY = y - 5; brushY < y + 5; brushY++) {
                for (let brushX = x - 5; brushX < x + 5; brushX++) {
                    if (brushX < 0 || brushY < 0) continue
                    this.array.set([brushY, brushX], 3)
                }
            }
        } else if (INPUT.gamepad.pressed.includes("RB")) {
            this.debouncedUpdateCollision()
        }
    }
    debouncedUpdateCollision = _.debounce(async () => {
        await useFetch("http://localhost:3000/api/updateCollision", {
            method: "POST",
            body: JSON.stringify(this.array),
            headers: {
                "Content-Type": "application/json",
            },
        })
    }, 150)
    get_element([y, x]) {
        try {
            return this.array.get([y, x])
        } catch (error) {
            return undefined
        }
    }
    is_tile_clear(x: number, y: number, mob = true) {
        const element = this.get_element([y, x])
        const mob_element = this.get_mob_element([y, x])
        const main_check = element !== 2 && element !== 3
        const mob_check = mob_element !== 2
        if (mob) return main_check && mob_check
        else return main_check
    }
    is_coord_clear(x: number, y: number, mob = true) {
        return this.is_tile_clear(COORD.to_tile(x), COORD.to_tile(y), mob)
    }
    get_mob_element([y, x]) {
        const size = this.mob_array.size()
        try {
            if (y >= 0 && y < size[0] && x >= 0 && x < size[1]) {
                return this.mob_array.get([y, x])
            } else {
                return 0
            }
        } catch (error) {
            return undefined
        }
    }
}
export const COLLISION = new Collision()
