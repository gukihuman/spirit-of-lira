class Global {
  hero: gEntity = {}
  heroId: number = 0
  lastHero: gEntity = {} // previous tick hero
  hover: gEntity = {}
  hoverId: number = 0
  context: "autoMove" | "follow" | "default" = "default"
}
export const gg = new Global()
