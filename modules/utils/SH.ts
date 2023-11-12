class Shortcuts {
  hero: AnyObject = {}
  heroId: number = 0
  stopHero() {
    this.hero.MOVE.finaldestination = _.clone(this.hero.POSITION)
  }
  init() {
    this.updateHero()
  }
  process() {
    this.updateHero()
  }
  private updateHero() {
    MUSEUM.processEntity(["HERO"], (entity, id) => {
      this.hero = entity
      this.heroId = id
    })
  }
}
export const SH = new Shortcuts()
