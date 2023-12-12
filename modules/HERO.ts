class Hero {
    entity: AnyObject = {}
    id: number = 0
    reset_destination() {
        this.entity.MOVE.final_destination = _.clone(this.entity.POSITION)
    }
    init() {
        this.updateHero()
    }
    process() {
        this.updateHero()
    }
    private updateHero() {
        MUSEUM.processEntity(["HERO"], (entity, id) => {
            this.entity = entity
            this.id = id
        })
    }
}
export const HERO = new Hero()
