class Flip {
    process() {
        MUSEUM.process_entity(["MOVE", "POS", "STATE", "TARGET"], (ent, id) => {
            if (ent.STATE.active === "dead") return
            if (LOOP.elapsed - ent.SPRITE.lastFlipMS < 200) return
            if (!WORLD.last.entities.get(id)) return
            const previousX = WORLD.last.entities.get(id).POS.x
            const container = SPRITE.getContainer(id)
            if (!container) return
            let before = 1
            const layerNames = [
                "backWeapon",
                "animation",
                "cloth",
                "frontWeapon",
            ]
            const layersToFlip: any[] = []
            layerNames.forEach((layerName) => {
                const layer = SPRITE.getLayer(id, layerName)
                if (!layer) return
                layersToFlip.push(layer)
                // take before from "animation" because all entities have it
                // other layers like "backWeapon" is the always the same
                if (layerName === "animation") before = layer.scale.x
            })
            // move
            if (ent.POS.x < previousX) {
                layersToFlip.forEach((layer) => (layer.scale.x = -1))
            } else if (ent.POS.x > previousX) {
                layersToFlip.forEach((layer) => (layer.scale.x = 1))
            }
            // attack target
            if (ent.TARGET.id && ent.STATE.track) {
                const targetEntity = WORLD.entities.get(ent.TARGET.id)
                if (targetEntity.POS.x < ent.POS.x) {
                    layersToFlip.forEach(
                        (container) => (container.scale.x = -1)
                    )
                } else if (targetEntity.POS.x > ent.POS.x) {
                    layersToFlip.forEach((container) => (container.scale.x = 1))
                }
            }
            if (SPRITE.getLayer(id, "animation")?.scale.x !== before) {
                ent.SPRITE.lastFlipMS = LOOP.elapsed
            }
        })
    }
}
export const FLIP = new Flip()
