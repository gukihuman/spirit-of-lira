class Remove {
    process() {
        MUSEUM.process_entity(["STATE", "NONHERO"], (ent, id) => {
            if (
                ent.STATE.active === "dead" &&
                LOOP.elapsed > ent.STATE.deadTimeMS + ent.STATE.deadDelayMS
            ) {
                const container = SPRITE.getContainer(id)
                if (!container) return
                container.destroy()
                SPRITE.entityContainers.delete(id)
                WORLD.entities.delete(id)
            }
        })
    }
}
export const REMOVE = new Remove()
