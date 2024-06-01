class Effects {
    front = {
        "sword-hit": 600,
        "bunbo-bite": 500,
    }
    back = {}
    init() {
        LOOP.add(() => {
            SPRITE.effectContainers.forEach((container, expireMS) => {
                const initiator_id = Number(container.name)
                const initiator_ent = WORLD.entities.get(initiator_id)
                const initiator_dead = initiator_ent.STATE.active === "dead"
                if (LOOP.elapsed > expireMS || initiator_dead) {
                    container.destroy()
                    // 📜 check if destroy is successful, sometimes effects hanging, mb its only hmr though
                    SPRITE.effectContainers.delete(expireMS)
                }
            })
        }, "EFFECTS")
    }
}
export const EFFECTS = new Effects()
