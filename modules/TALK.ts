class Talk {
    component = {
        distance: 200,
        scene: "",
        instantChoices: true, // maybe, just maybe some talk without it :)
        x: -60,
        y: -100,
    }
    updatePOS = false
    talkEntity
    process() {
        MUSEUM.process_entity(["TALK"], (entity) => {
            if (
                COORD.distance(entity.POS, HERO.entity.POS) <
                entity.TALK.distance
            ) {
                this.talkEntity = entity
            }
        })
        if (!this.talkEntity) return
        if (
            COORD.distance(this.talkEntity.POS, HERO.entity.POS) <
            this.talkEntity.TALK.distance
        ) {
            INTERFACE.talk = true
            this.updatePOS = true
            this.debouncedTurnOff()
        } else {
            INTERFACE.talk = false
        }
        if (this.updatePOS) {
            INTERFACE.talkEntity = this.talkEntity.name
            INTERFACE.talkPOS = {
                x:
                    this.talkEntity.POS.x -
                    HERO.entity.POS.x +
                    CONFIG.viewport.width / 2 +
                    this.talkEntity.TALK.x,
                y:
                    this.talkEntity.POS.y -
                    HERO.entity.POS.y +
                    CONFIG.viewport.height / 2 +
                    this.talkEntity.TALK.y,
            }
        }
    }
    debouncedTurnOff = _.debounce(() => {
        this.updatePOS = false
        this.talkEntity = null
    }, 500)
    init() {
        EVENTS.onSingle("talk", () => this.emit())
    }
    emit() {
        if (!this.talkEntity) return
        if (HERO.entity.STATE.active === "dead") return
        if (GLOBAL.sceneContextChangedMS + 1000 > LOOP.elapsed) return
        EVENTS.emit("startScene", {
            name: this.talkEntity.TALK.scene,
            instantChoices: this.talkEntity.TALK.instantChoices,
        })
    }
}
export const TALK = new Talk()
