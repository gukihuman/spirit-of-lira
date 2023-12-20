class Hover {
    process() {
        if (GLOBAL.lastActiveDevice === "gamepad") return
        const point = COORD.mouseOfScreen()
        const heroPOS = HERO.ent.POS
        const intersections: number[] = []
        let hoverEntityId = 0
        MUSEUM.process_entity(["NONHERO", "MOVE", "SIZE"], (ent, id) => {
            const POS = ent.POS
            const rect = {
                x:
                    POS.x -
                    heroPOS.x +
                    CONFIG.viewport.width / 2 -
                    ent.SIZE.width / 2,
                y:
                    POS.y -
                    heroPOS.y +
                    CONFIG.viewport.height / 2 -
                    ent.SIZE.height +
                    ent.SIZE.bottom,
                width: ent.SIZE.width,
                height: ent.SIZE.height,
            }
            const intersectX = point.x < rect.x + rect.width && point.x > rect.x
            const intersectY =
                point.y < rect.y + rect.height && point.y > rect.y
            if (intersectX && intersectY && ent.STATE.active !== "dead")
                intersections.push(id)
        })
        // in case there is more than one ent under the mouse
        if (intersections.length > 1) {
            let higherY = 0
            intersections.forEach((id) => {
                if (WORLD.entities.get(id).POS.y > higherY) {
                    higherY = WORLD.entities.get(id).POS.y
                    hoverEntityId = id
                }
            })
        } else if (intersections.length === 1) {
            hoverEntityId = intersections[0]
        }
        if (hoverEntityId) {
            GLOBAL.hoverId = hoverEntityId
            WORLD.hover = WORLD.entities.get(hoverEntityId)
            this.debouncedEmpty()
        }
    }
    debouncedEmpty = _.debounce(() => {
        GLOBAL.hoverId = null
        WORLD.hover = null
    }, 120)
}
export const HOVER = new Hover()
