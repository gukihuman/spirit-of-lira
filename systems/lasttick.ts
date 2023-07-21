export default class {
  entities: Map<number, any> = new Map()

  process() {
    this.entities = LIB.cloneMapDeep(WORLD.entities)
    SYSTEM_DATA.world.lastHero = this.entities.get(SYSTEM_DATA.world.heroId)
  }
}
