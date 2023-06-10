class Global {
  hero: gEntity = {}
  heroId: number = 0
  lastHero: gEntity = {} // previous tick hero
  hover: gEntity = {}
  hoverId: number = 0
}
export const GLOBAL = new Global()
