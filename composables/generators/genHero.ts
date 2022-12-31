class Hero {
  x: number
  y: number

  constructor() {
    this.x = 660
    this.y = 110
  }
}
export function genHero(): Hero {
  return new Hero()
}
