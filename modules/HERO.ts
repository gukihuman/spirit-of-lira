class Hero {
    entity: AnyObject = {}
    id: number = 0
    last = { entity: this.entity, id: this.id }
    reset_final_des() {
        this.entity.MOVE.final_des = _.clone(this.entity.POS)
    }
    init() {
        this.updateHero()
    }
    process() {
        this.updateHero()
    }
    private updateHero() {
        MUSEUM.process_entity(["HERO"], (entity, id) => {
            this.entity = entity
            this.id = id
        })
    }
}
export const HERO = new Hero()
