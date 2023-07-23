export default class {
  entities: Map<number, any> = new Map()

  process() {
    this.entities = LIB.cloneMapDeep(WORLD.entities)
    WORLD.lastHero = this.entities.get(WORLD.heroId)
  }
}
