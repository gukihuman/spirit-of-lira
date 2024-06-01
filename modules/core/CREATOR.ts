class Creator {
    private nextId = 1
    async createStatic(
        name: string,
        components?: { [key: string]: any },
        pool: AnyObject = ENTITIES_STATIC.collection
    ) {
        this.create(name, components, pool)
    }
    /**  @returns promise of ent id or undefined */
    async create(
        name: string,
        components?: { [key: string]: any },
        pool: AnyObject = ENTITIES.collection
    ) {
        const ent = _.cloneDeep(pool[name])
        if (!ent) {
            LIBRARY.logWarning(`"${name}" not found (CREATOR)`)
            return
        }
        ent.name = name
        const id = this.nextId
        ent.id = id
        this.nextId++
        // inject / expand components from argument
        _.forEach(components, (value, name) => (ent[name] = _.cloneDeep(value)))
        // inject / expand components from components folder
        await this.injectComponents(ent, id)
        WORLD.entities.set(id, ent)
        if (name === "lira") {
            await SPRITE.ent(ent, id, {
                randomFlip: false,
                layers: [
                    "shadow",
                    "backEffect",
                    "backWeapon",
                    "animation",
                    "cloth",
                    "frontWeapon",
                    "frontEffect",
                ],
            })
        } else if (ent.name.includes("cursor")) {
            await SPRITE.staticEntity(ent, id, {
                randomFlip: false,
                parent: "top",
            })
        } else if (!ent.MOVE) {
            if (ASSETS.jsons[name]) {
                await SPRITE.ent(ent, id, { randomFlip: false })
            } else {
                await SPRITE.staticEntity(ent, id, { randomFlip: false })
            }
        } else await SPRITE.ent(ent, id)
        return id
    }
    /** inject / expand components from components folder */
    private async injectComponents(ent, id: number) {
        // 📜 move sorting outside to calculate it only once
        const sortedPriority = LIBRARY.sortedKeys(
            CONFIG.priority.componentInject
        )
        const promises: Promise<void>[] = []
        sortedPriority.forEach((name) => {
            const value = globalThis[name].component
            if (!value) return
            // ent model has this component or component is auto injected
            if (ent[name] || value.autoInject) {
                this.dependCounter = 0
                promises.push(this.mergeComponent(ent, id, value, name))
            }
        })
        await Promise.all(promises)
    }
    private dependCounter = 0
    private async mergeComponent(ent, id, value, name) {
        this.dependCounter++
        if (this.dependCounter > 100) {
            LIBRARY.logWarning(
                `"more than 100 loops of merging components, likely a circular dependency (CREATOR)`
            )
            return
        }
        // inject dependencies components before init
        if (value.depend) {
            const promises: Promise<void>[] = []
            value.depend.forEach((dependName) => {
                if (ent[dependName]) return
                const dependValue = globalThis[dependName].component
                if (!dependValue) {
                    LIBRARY.logWarning(
                        `"${dependName}" as a "${name}" dependency is not found (CREATOR)`
                    )
                    return
                }
                promises.push(
                    this.mergeComponent(ent, id, dependValue, dependName)
                )
            })
            await Promise.all(promises)
        }
        ent[name] = _.merge(_.cloneDeep(value), ent[name])
        if (ent[name].inject) await ent[name].inject(ent, id)
        // inject triggered components after init
        if (ent[name].trigger) {
            const promises: Promise<void>[] = []
            value.trigger.forEach((triggerName) => {
                if (ent[triggerName]) return
                const triggerValue = globalThis[triggerName].component
                if (!triggerValue) {
                    LIBRARY.logWarning(
                        `"${triggerName}" as a "${name}" trigger is not found (CREATOR)`
                    )
                    return
                }
                promises.push(
                    this.mergeComponent(ent, id, triggerValue, triggerName)
                )
            })
            await Promise.all(promises)
        }
        delete ent[name].autoInject
        delete ent[name].depend
        delete ent[name].trigger
        delete ent[name].inject
        if (!ent.HERO) ent.NONHERO = true
        if (ent.NONHERO && ent.MOVE) ent.MOB = true
    }
}
export const CREATOR = new Creator()
