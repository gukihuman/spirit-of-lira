class Save {
    startSave: AnyObject = {}
    save: AnyObject = {}
    updatePeriodMS = 1000
    lastUpdateMS = 0
    preventUpdate = false // for now only when reset in initialized
    init() {
        const storageSave = this.parseLocal("save") || this.save
        this.startSave = {
            version: GLOBAL.version,
            hero: {
                POS: HERO.ent.POS,
                health: HERO.ent.ATTRIBUTES.health,
            },
            inventory: {
                bag: INVENTORY.bag,
                gear: INVENTORY.gear,
            },
            progress: {
                scenes: PROGRESS.scenes,
                mobs: PROGRESS.mobs,
            },
            settings: {
                echo: { general: SETTINGS.echo.general },
                worldInputEvents: SETTINGS.worldInputEvents,
                novelInputEvents: SETTINGS.novelInputEvents,
                interfaceInputEvents: SETTINGS.interfaceInputEvents,
                inputOther: SETTINGS.inputOther,
            },
        }
        // takes start save and fill it with storage values recursively
        // storage keys that dosnt exist in start save are simply removed for now
        // in the future we might add logic for specific versions of storage save
        this.save = this.resolveSaves(this.startSave, storageSave)

        // 📜 do some logic to declare this in one place - not in update too
        HERO.ent.POS = this.save.hero.POS
        HERO.ent.ATTRIBUTES.health = this.save.hero.health
        INVENTORY.bag = this.save.inventory.bag
        INVENTORY.gear = this.save.inventory.gear
        PROGRESS.scenes = this.save.progress.scenes
        PROGRESS.mobs = this.save.progress.mobs
        SETTINGS.echo.general = this.save.settings.echo.general
        SETTINGS.worldInputEvents = this.save.settings.worldInputEvents
        SETTINGS.novelInputEvents = this.save.settings.novelInputEvents
        SETTINGS.interfaceInputEvents = this.save.settings.interfaceInputEvents
        SETTINGS.inputOther = this.save.settings.inputOther

        HERO.reset_final_des() // update final des otherwise hero run at the start
    }
    update() {
        if (this.preventUpdate) return
        // clone deep is important especially with pinia stores
        this.save.hero.POS = _.cloneDeep(HERO.ent.POS)
        this.save.hero.health = _.cloneDeep(HERO.ent.ATTRIBUTES.health)
        this.save.inventory.bag = _.cloneDeep(INVENTORY.bag)
        this.save.inventory.gear = _.cloneDeep(INVENTORY.gear)
        this.save.progress.scenes = _.cloneDeep(PROGRESS.scenes)
        this.save.progress.mobs = _.cloneDeep(PROGRESS.mobs)
        this.save.settings.echo = _.cloneDeep(SETTINGS.echo.general)
        this.save.settings.worldInputEvents = _.cloneDeep(
            SETTINGS.worldInputEvents
        )
        this.save.settings.novelInputEvents = _.cloneDeep(
            SETTINGS.novelInputEvents
        )
        this.save.settings.interfaceInputEvents = _.cloneDeep(
            SETTINGS.interfaceInputEvents
        )
        this.save.settings.inputOther = _.cloneDeep(SETTINGS.inputOther)
        this.stringifyLocal("save", this.save)
    }
    process() {
        if (LOOP.elapsed > this.lastUpdateMS + this.updatePeriodMS) {
            this.update()
            this.lastUpdateMS = LOOP.elapsed
        }
    }
    reset() {
        this.preventUpdate = true
        this.stringifyLocal("save", SAVE.startSave)
        location.reload()
    }
    private parseLocal(key: string) {
        const data = localStorage.getItem(key)
        if (!data) return
        return JSON.parse(data)
    }
    stringifyLocal(key: string, data: AnyObject) {
        localStorage.setItem(key, JSON.stringify(data))
    }
    private resolveSaves(start, storage) {
        let resolved = {}
        _.forEach(start, (value, key) => {
            if (storage.hasOwnProperty(key)) {
                if (LIBRARY.isObject(value)) {
                    resolved[key] = this.resolveSaves(value, storage[key])
                } else if (typeof value === typeof storage[key]) {
                    resolved[key] = storage[key]
                } else {
                    resolved[key] = value
                }
            } else {
                resolved[key] = value
            }
        })
        return resolved
    }
}
export const SAVE = new Save()
