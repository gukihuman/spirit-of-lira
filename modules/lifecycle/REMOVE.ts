class Remove {
    process() {
        MUSEUM.process_entity(["STATE", "NONHERO"], (entity, id) => {
            if (
                entity.STATE.active === "dead" &&
                LOOP.elapsed >
                    entity.STATE.deadTimeMS + entity.STATE.deadDelayMS
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
