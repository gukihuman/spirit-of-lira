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
    }
    private who_is_hero() {
        MUSEUM.process_entity(["HERO"], (ent, id) => {
            this.ent = ent
            this.id = id
        })
    }
}
export const HERO = new Hero()
