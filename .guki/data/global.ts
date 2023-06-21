class Global {
  hero: Entity = {}
  heroId: number = 0
  lastHero: Entity = {} // previous tick hero
  hover: Entity = {}
  hoverId: number = 0
}
export const GLOBAL = new Global()
