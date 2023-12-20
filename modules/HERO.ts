import { g } from "vitest/dist/index-40ebba2b"

class Hero {
    ent: AnyObject = {}
    id: number = 0
    last = { ent: this.ent, id: this.id }
    reset_final_des() {
        this.ent.MOVE.final_des = _.clone(this.ent.POS)
    }
    init() {
        this.who_is_hero()
    }
    process() {
        this.who_is_hero()
        if (this.id !== this.last.id) EVENTS.emitSingle("hero changed")

        if (!this.ent.MOVE || !this.last.ent.MOVE) return
        const des = this.ent.MOVE.final_des
        const last_des = this.last.ent.MOVE.final_des
        if (!_.isEqual(des, last_des)) {
            EVENTS.emitSingle("hero final destination changed")
        }
    }
    private who_is_hero() {
        MUSEUM.process_entity(["HERO"], (ent, id) => {
            this.ent = ent
            this.id = id
        })
    }
}
export const HERO = new Hero()
