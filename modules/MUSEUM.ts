// functions that is used by other modules that may conflict with LIBRARY order of usage creating circular dependencies, basically this is a place to put shared functions if there is some order conflict
class Museum {
    process_entity(
        components: string[] | string,
        fn: (ent, id: number) => void
    ) {
        WORLD.entities.forEach((ent, id) => {
            let satisfied = true
            if (typeof components === "string") {
                if (!ent[components]) satisfied = false
            } else {
                components.forEach((component) => {
                    if (!ent[component]) satisfied = false
                })
            }
            if (satisfied) fn(ent, id)
        })
    }
}
export const MUSEUM = new Museum()
