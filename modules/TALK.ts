interface TalkEntity extends AnyObject {
    TALK: AnyObject
}
class Talk {
    component = {
        distance: 320,
        scene: "",
        instantChoices: true, // maybe, just maybe some talk without it :)
        x: -60,
        y: -100,
    }
    talk_ents: TalkEntity[] = []
    talk_POSs: { x: number; y: number }[] = []
    closest_talk_ent_i: number = 0
    closest_talk_ent: TalkEntity | null = null
    process() {
        let min_dist = Infinity
        this.talk_ents.forEach((ent, i) => {
            const dist = COORD.distance(ent.POS, HERO.ent.POS)
            if (dist < min_dist) {
                this.closest_talk_ent_i = i
                min_dist = dist
            }
        })
        this.closest_talk_ent = this.talk_ents[this.closest_talk_ent_i]
        if (
            COORD.distance(this.closest_talk_ent.POS, HERO.ent.POS) <
            this.closest_talk_ent.TALK.distance
        ) {
            INTERFACE.talk = true
        } else {
            INTERFACE.talk = false
        }
        // mb some condition for cooling
        if (true) {
            INTERFACE.closest_talk_ent_i = this.closest_talk_ent_i
            this.talk_ents.forEach((ent, i) => {
                this.talk_POSs[i].x =
                    ent.POS.x -
                    HERO.ent.POS.x +
                    CONFIG.viewport.width / 2 +
                    ent.TALK.x
                this.talk_POSs[i].y =
                    ent.POS.y -
                    HERO.ent.POS.y +
                    CONFIG.viewport.height / 2 +
                    ent.TALK.y

                // tricky update so vue reactivity see the updates
                INTERFACE.talk_POSs.splice(i, 1, {
                    x: this.talk_POSs[i].x,
                    y: this.talk_POSs[i].y,
                })
            })
        }
    }
    init() {
        EVENTS.onSingle("talk", () => this.emit())
        MUSEUM.process_entity(["TALK"], (ent: TalkEntity) => {
            this.talk_ents.push(ent)
            this.talk_POSs.push({ x: 0, y: 0 }) // update in process
            INTERFACE.talk_POSs.push({ x: 0, y: 0 })
        })
    }
    // also used by talk.vue
    emit() {
        if (!INTERFACE.talk) return
        if (!this.closest_talk_ent) return
        if (HERO.ent.STATE.active === "dead") return
        if (GLOBAL.sceneContextChangedMS + 1000 > LOOP.elapsed) return
        EVENTS.emit("startScene", {
            name: this.closest_talk_ent.TALK.scene,
            instantChoices: this.closest_talk_ent.TALK.instantChoices,
        })
    }
}
export const TALK = new Talk()
