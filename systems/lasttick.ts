export default class {
  entities: Map<number, any> = new Map()

  process() {
    this.entities = LIB.cloneMapDeep(WORLD.entities)
    STATES.lastHero = this.entities.get(STATES.heroId)
  }
}
