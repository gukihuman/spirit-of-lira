class Hero {
  x: number
  y: number
  json: string

  constructor() {
    this.x = 660
    this.y = 110
    this.json = new URL("@/assets/hero/hero.json", import.meta.url).href
  }
}

export function genHero(): Hero {
  return new Hero()
}
